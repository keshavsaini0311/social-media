/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Header from '../components/Header';
import Conversation from '../components/Conversation';
import Messages from '../components/Messages';
import MessageInput from '../components/MessageInput';

const socket = io.connect("http://localhost:5000");

function ChatPage() {
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [conversations, setConversations] = useState([]);  
  const [selectedConversation, setSelectedConversation] = useState(null);
  console.log(conversations,selectedConversation );
  useEffect(() => {
    const getConversations = async () => {
      try {
        setLoadingConversations(true);
        const res = await fetch("/api/messages/conversations");
        const data = await res.json();
        if (data.success=== false) {
          setLoadingConversations(false);
          console.log(data);
          console.log("Error", data, "error");
          return;
        }
        setLoadingConversations(false);
        setConversations(data);
      } catch (error) {
        console.log("Error", error.message, "error");
        setLoadingConversations(false);
      }
    };

    getConversations();
  }, [ setConversations]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageReceived(data.message);
    });
  }, []);

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
    }
  };

  const sendMessage = () => {
    socket.emit("send_message", { message, room });
  };

  return (
    <div className="container">
      <Header />
      <div className="mt-5 flex">
        <div className="">
          {loadingConversations||!conversations ? (
            <div className="d-flex justify-content-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            
            conversations.map((conversation) => (
              
              <div key={conversation._id} onClick={() => setSelectedConversation(conversation)}>
                <Conversation
                  conversation={conversation.participants[1]}
                  lastMessage={conversation.lastMessage.text}
                />
              </div>
              
            ))
          )}
        </div>
        <div className="sm:w-5/6 w-1/2 text-white">
          {selectedConversation ? (
            <>
              <div  className="bg-gray-400">
                {console.log(selectedConversation)}
                <Messages selectedConversation={selectedConversation} />
              </div>
              <MessageInput recipientId={selectedConversation} />
            </>
          ) : (
            <div className="d-flex justify-content-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Select a conversation</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
