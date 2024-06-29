/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import io from 'socket.io-client'
import Header from '../components/Header';
const socket=io.connect("http://localhost:5000")
function ChatPage() {

    const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");
  const[loadingConversations,setLoadingConversations]=useState(false)
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const getConversations = async () => {
			try {
				const res = await fetch("/api/messages/conversations");
				const data = await res.json();
				if (data.success===false) {
					console.log("Error", data, "error");
					return;
				}
				console.log(data);
				setConversations(data);
			} catch (error) {
				console.log("Error", error.message, "error");
			} finally {
				setLoadingConversations(false);
			}
		};

		getConversations();
	}, [ setConversations]);

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
    <div>
      <Header />
      
    </div>
  )
}

export default ChatPage
