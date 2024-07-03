/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';

const socket = io.connect("http://localhost:5000");

export default function Messages({ selectedConversation }) {
  const [loadingMessages, setLoadingMessages] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const getMessages = async () => {
      if (!selectedConversation) return;

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
  }, [selectedConversation, setMessages]);

  return (
    <div>
      {loadingMessages ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        messages.map((message) => (
          <div key={message._id} className="m-2">
            <div className={message.sender === currentUser._id ? "text-right text-wrap" : "text-left items-start text-wrap"}>
              <p>{message.text}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
