/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import {FiSend} from 'react-icons/fi'



export default function MessageInput({ recipientId }) {
  // const socket=useMemo(()=>io("http://localhost:5000"),[]);
  const socket=io.connect("http://localhost:5000");
  // const [room, setRoom] = useState("");
  // Messages States
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");
useEffect(()=>{
  // console.log(recipientId._id);
      socket.emit("join_room","a");
  
},[]);
 

  const sendMessage = () => {
    const id="a";
   
    socket.emit("send_message", { message, id});
    
    socket.on("receive_message", (data) => {
     
      console.log(data.message);
      setMessageReceived(data.message);
    });

  };
  // useEffect(() => {
   
  // }, [socket]);

  // useEffect(() => {
   
  // }, [socket]);
//  const [messages,setMessages]=useState([]);
//   const [socketId,setSocketId]=useState("");
//   const [roomName,setroomName]=useState(recipientId._id);
//   const [formData, setFormData] = useState({
//     message: '',
//     recipientId: recipientId.participants[0] ,
//   });
//   const [message,setMessage]=useState('');
 
//   useEffect(()=>{
//     setroomName(recipientId._id);
//     console.log(roomName);

//     socket.on("connect",()=>{
//        setSocketId(socket.id);
//        console.log("connected",socket.id);
      
//      }) 
    
//     //  socket.emit('join-room',roomName); 
//   },
//    [message]);

// useEffect(()=>{
//   socket.on("receive-message",(data)=>{
//     console.log("Message Is:"+data);
//     setMessages((messages)=>[...messages,data]);


//    })
// },[socket])


//   // useEffect(() => {
//   //   const getuser = async () => {
//   //     try {
//   //       const res = await fetch(`/api/user/${recipientId.participants[0]}`);
//   //       const data = await res.json();
//   //       setFormData({ ...formData, recipientId: data._id });
//   //     } catch (error) {
//   //       console.log(error);
//   //     }
//   //   }
//   //   getuser();
//   // }, [recipientId]);
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     //TODO:Store this message in Message Model
//     // console.log("ROM<:"+roomName);
//     socket.emit("message",{message});
    

//     try {
//       const res = await fetch('/api/messages', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });
//       const data = await res.json();
//       if (data.success===false) {
//         console.log(data);
//         return;
//       }
//       setFormData({ ...formData, message: '' });
      
//     } catch (error) {
//       console.log(error);
//     }
//   };

  return (
    <>

    <form  onSubmit={sendMessage}>
      <div >

      <div className='text-black   w-full flex'>
        <input
          type="text"
          value={message}
          // onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          onChange={(e)=>setMessage(e.target.value)}
          className=' outline-none bg-gray-50 p-1.5 w-full rounded-lg'
          placeholder="Type a message..."
        />
        <div className="text-right m-1 p-2 rounded-full bg-slate-200">
          <button type="submit" className='text-right text-blue-600'> <FiSend /></button>
          </div>
        </div>
      </div>
    </form>
   <div>
    {messageReceived}
   </div>
    </>
  );
}




