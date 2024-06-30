/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import io from 'socket.io-client'
import Header from '../components/Header';
import Conversation from '../components/Conversation';
const socket=io.connect("http://localhost:5000")
function ChatPage() {
  const tep=0;
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");
  const[loadingConversations,setLoadingConversations]=useState(false)
  const [conversations, setConversations] = useState([]);  
  useEffect(() => {
    const getConversations = async () => {
			try {
        setLoadingConversations(true);
				const res = await fetch("/api/messages/conversations");
				const data = await res.json();
				if (data.success===false) {
          setLoadingConversations(false);
					console.log("Error", data, "error");
					return;
				} 
        setLoadingConversations(false);
				setConversations(data);
			} catch (error) {
				console.log("Error", error.message, "error");
			} finally {
				setLoadingConversations(false);
			}
		};

		getConversations();
	}, [ setConversations]);
  console.log(conversations);

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
    }
  };

  const sendMessage = () => {
    socket.emit("send_message", { message, room });
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageReceived(data.message);
    });
  }, [socket]);
  
  return (
    <div className="container">
      <Header />
      <div className="mt-5">

      {loadingConversations ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        conversations.map((conversation) => (
          <Conversation
            key={conversation._id}
            conversation={conversation.participants[0]}
            lastmessage={conversation.lastMessage.text}
          />
        ))
      )}
      </div>
    </div>
  )
}

export default ChatPage
