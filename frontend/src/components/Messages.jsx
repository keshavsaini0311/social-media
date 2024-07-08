/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';

const socket = io.connect("http://localhost:5000");

export default function Messages({ selectedConversation }) {
  console.log("selected:"+selectedConversation);

  const [loadingMessages, setLoadingMessages] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [messages, setMessages] = useState([]);

  const [messageReceived, setMessageReceived] = useState("");
  console.log(messageReceived);
  socket.on("newMessage", (message) => {
    if (selectedConversation._id === message.conversationId) {
      setMessages((prev) => [...prev, message]);
      console.log("New Message", message);
    }
  });

  useEffect(() => {
    const getMessages = async () => {
      // if (!selectedConversation) return;

      try {
        setLoadingMessages(true);
        const id = selectedConversation.participants[0];
        const res = await fetch(`/api/messages/${id}`);
        const data = await res.json();
        if (data.success===false) {
          console.log("Error", data, "error");
          setLoadingMessages(false);
          return;
        }
        setMessages(data);
        setLoadingMessages(false);
      } catch (error) {
        console.log("Error", error.message, "error");
        setLoadingMessages(false);
      }
    };
    

    getMessages();

  }, [selectedConversation, setMessages,messageReceived]);

  const messagesEndRef = useRef(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="text-black ">
      {loadingMessages ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col">
        {
          messages && messages.map((message) => (
            <div key={message._id} className={`flex ${message.sender === currentUser._id ? "justify-end " : "justify-start  "}`}>
            <div className={`inline-block p-2 m-2 rounded-lg max-w-sm bg-blue-400 break-words  `}>
            {message.text}</div>
              </div>
          
        ))
      }
      <div ref={messagesEndRef} />
      </div>
      )}
    </div>
  );
}
