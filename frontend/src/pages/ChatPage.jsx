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
  const [searchTerm, setSearchTerm] = useState("");

  console.log(conversations );

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

  const handlechange =async (e) => {
    setSearchTerm(e.target.value);
    
  }

  useEffect(() => {
    const getConversations = async () => {
      try {
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
    
    const fetchUsers = async () => {
      if (!searchTerm || searchTerm.length < 1) {
        return;
      }
      if (searchTerm) {
        // change conversation to those user who matches the search term
        const response = await fetch(`/api/user/search?searchTerm=${searchTerm}`);
        const data = await response.json();
        const useridset=new Set();
		    data.forEach((user) => {
			  useridset.add(user._id);
        }); 
        const filteredConversations = conversations.filter((conversation) => {
          return useridset.has(conversation.participants[0]) || useridset.has(conversation.participants[1]);
        })
        setConversations(filteredConversations);
      }
    };
    if(conversations.length>0|| searchTerm.length>0) {
      setTimeout(() => fetchUsers()
      , 20);
    }
  }, [ searchTerm]);

  return (
    <div className="">
      <Header />
      <div className="flex flex-col w-full sm:flex-row mt-5 gap-3">
        <div className="">
          {loadingConversations||!conversations ? (
            <div className="flex sm:flex-col justify-content-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div  className="sm:flex-col gap-2 p-2 ml-2 sm:h bg-slate-300 rounded-xl flex overflow-scroll no-scrollbar ">
              <div className="m-auto">
                <input value={searchTerm} type="text" className='p-2  rounded-xl' placeholder='Search' onChange={handlechange} />
              </div>
            { conversations.map((conversation) => (             
              <div className={`rounded-lg p-3 hover:bg-indigo-200 ${selectedConversation&& conversation._id === selectedConversation._id && "bg-indigo-300"}`} key={conversation._id} onClick={() => setSelectedConversation(conversation)}>
                <Conversation
                  conversation={conversation.participants[0]}
                  lastMessage={conversation.lastMessage.text}
                  />
              </div>
            ))}
            </div>
          )}
        </div>
        <div className="w-full text-white">
          {selectedConversation ? (
            <>
              <div style={{ height: "70vh" }} className="sm:h p-3 gap-2 rounded-2xl mx-auto w-5/6 sm:w-11/12 bg-gradient-to-r from-green-200 to-blue-300 no-scrollbar overflow-scroll">
                <Messages selectedConversation={selectedConversation} />
                <div className="p-2 sticky bottom-0">
                <MessageInput recipientId={selectedConversation} />
                </div>
              </div>
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
