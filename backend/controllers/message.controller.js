import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
import User from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";
import { errorHandler } from '../utils/error.js';

async function sendMessage(req, res) {
	try {
		const { recipientId, message } = req.body;
		let { img } = req.body;
		const senderId = req.user.id;

		let conversation = await Conversation.findOne({
			participants: { $all: [senderId, recipientId] },
		});

		if (!conversation) {
			conversation = new Conversation({
				participants: [senderId, recipientId],
				lastMessage: {
					text: message,
					sender: senderId,
				},
			});
			await conversation.save();
		}
		if (img) {
			const uploadedResponse = await cloudinary.uploader.upload(img);
			img = uploadedResponse.secure_url;
		}

		const newMessage = new Message({
			conversationId: conversation._id,
			sender: senderId,
			text: message,
			img: img || "",
		});

		await Promise.all([
			newMessage.save(),
			conversation.updateOne({
				lastMessage: {
					text: message,
					sender: senderId,
				},
			}),
		]);
		

		res.status(201).json(conversation);
	} catch (error) {
		next(error);
	}
}

async function getMessages(req, res) {
	const { otherUserId } = req.params;
	const userId = req.user.id;
	try {
		const conversation = await Conversation.findOne({
			participants: { $all: [userId, otherUserId] },
		});

		if (!conversation) {
			return next(errorHandler(404,'Conversation not found!'));
		}

		const messages = await Message.find({
			conversationId: conversation._id,
		}).sort({ createdAt: 1 });

		res.status(200).json(messages);
	} catch (error) {
		res.status(500).json({ error: error.message,success:false });
	}
}

async function getConversations(req, res) {
	const userId = req.user.id;
	try {
		const conversations = await Conversation.find({ participants: userId }).sort({updatedAt:-1});

		if (!conversations) {
			return res.status(404).json({ error: "No conversations found",success:false });
		}
		// remove the current user from the participants array
		conversations.forEach((conversation) => {
			var index=conversation.participants.indexOf(userId);
			if (index !== -1){
			conversation.participants.splice(index, 1);
			}
		});
		
		res.status(200).json(conversations);
	} catch (error) {
		res.status(500).json({ error: error.message,success:false });
	}
}

async function getconversationfromusername(req, res) {
	const userId = req.user.id;
	console.log(userId);
	const searchTerm = req.query.searchTerm || '';
	console.log(searchTerm);
	try {
        const users = await User.find({
            userName: { $regex: searchTerm, $options: 'i' },
        });
		if (!users) return next(errorHandler(404, 'User not found!'));
		const useridset=new Set();
		users.forEach((user) => {
			useridset.add(user._id);
		});
		try {
			
			const conversations = await Conversation.find({ participants: userId }).sort({updatedAt:-1});
			const filteredConversations = conversations.filter((conversation) => {
				return useridset.has(conversation.participants[0]) || useridset.has(conversation.participants[1]);
			})

			if (!filteredConversations) {
				return res.status(404).json({ error: "No conversations found",success:false });
			}

			res.status(200).json(filteredConversations);
		} catch (error) {
			res.status(500).json({ error: error.message,success:false });
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error.message,success:false });
	}
		
}

export { sendMessage, getMessages, getConversations, getconversationfromusername };
