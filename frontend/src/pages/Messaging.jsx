import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
const socket=io.connect("http://localhost:5000")
export const Messaging = () => {
    
  //room State
  const [room, setRoom] = useState("");

  // Messages States
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");

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
    <div className='flex flex-col gap-y-10 mx-auto'>
       
       <div className='flex space-x-10'>
        
       <input type="text"  className='bg-cyan-400 text-white' onChange={(event)=>{
            setRoom(event.target.value);
        }}/>

        <button onClick={joinRoom}>JOIN</button>
       </div>

   <div  className='flex space-x-10'>
    
   <input type="text"  className='bg-cyan-400 text-white'  onChange={(event)=>{
            setMessage(event.target.value);
        }}/>
        <button onClick={sendMessage}>Send</button>
   </div>
{
   console.log("messagge",messageReceived)
}
        <h1 className='text-center text-3xl text-cyan-700'>{messageReceived}</h1>
    </div>
  )
}
