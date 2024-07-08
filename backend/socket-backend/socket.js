import { Server } from "socket.io";
import http from "http";
import express from "express";
import Message from "../models/messageModel.js";
import Conversation from "../models/conversationModel.js";
import { lookupService } from "dns/promises";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors:{
        origin:"*",
        methods:["GET","POST"],
        credentials:true,
	}
}); 

export const getRecipientSocketId = (recipientId) => {
	return userSocketMap[recipientId];
};

const userSocketMap = {}; // userId: socketId

io.on("connection", (socket) => {
	const userId = socket.id;
	console.log(`User Connected ${socket.id}`);
	// if (userId != "undefined") userSocketMap[userId] = socket.id;
	// io.emit("getOnlineUsers", Object.keys(userSocketMap));

	// socket.on("markMessagesAsSeen", async ({ conversationId, userId }) => {
	// 	try {
	// 		await Message.updateMany({ conversationId: conversationId, seen: false }, { $set: { seen: true } });
	// 		await Conversation.updateOne({ _id: conversationId }, { $set: { "lastMessage.seen": true } });
	// 		io.to(userSocketMap[userId]).emit("messagesSeen", { conversationId });
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// });
	

	socket.on("join_room", (data) => {
		console.log(data);
		socket.join(data);
	  });
	
socket.on("send_message", (data) => {
	console.log(data);
    socket.to(data.room).emit("receive_message", data);
  });

	//    socket.on("join-room",(room)=>{
	// 	console.log("hello ");
	// 	console.log(room);
	// 	socket.join(room);
		
		
	//    })


	socket.on("disconnect", () => {
		
		// io.emit("getOnlineUsers", Object.keys(userSocketMap));
	});
});

export { io, server, app };


// import { Server } from "socket.io";
// import http from "http";
// import express from "express";
// import Message from "../models/messageModel.js";
// import Conversation from "../models/conversationModel.js";

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "*", // Adjust this to your frontend URL
//     methods: ["GET", "POST"],
//     credentials: true,
//   }
// });

// // Mapping of userId to socketId
// const userSocketMap = {};

// io.on("connection", (socket) => {
//   const userId = socket.id;
//   console.log(`User Connected ${socket.id}`);

//   // Handle incoming messages
//   socket.on("message", ({ message, roomName }) => {
//     console.log("Received message:", message);
//     console.log("Room:", roomName);
//     socket.to(roomName).emit("receive-message", message);
//   });

//   // Handle joining a room
//   socket.on("join-room", (room) => {
//     console.log(`User joining room: ${room}`);
//     socket.join(room);
//   });

//   // Handle disconnection
//   socket.on("disconnect", () => {
//     console.log(`User Disconnected ${socket.id}`);
//   });
// });

// export { io, server, app };
