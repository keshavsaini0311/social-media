/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import {FiSend} from 'react-icons/fi'
import { useSelector } from 'react-redux';


const socket = io.connect("http://localhost:5000");

export default function MessageInput({ recipientId }) {

  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    message: '',
    recipientId: recipientId.participants[0] ,
  });
  useEffect(() => {
    const getuser = async () => {
      try {
        const res = await fetch(`/api/user/${recipientId.participants[0]}`);
        const data = await res.json();
        setFormData({ ...formData, recipientId: data._id });
      } catch (error) {
        console.log(error);
      }
    }
    getuser();
  }, [recipientId]);

  useEffect(()=>{
    console.log(recipientId._id);
        socket.emit("join_room", recipientId._id);
  },[recipientId]);
  
  const handleSubmit = async (e) => {
    
      const id=recipientId._id;
     const message = formData.message;
     const sender=currentUser._id
      socket.emit("send_message", { message, id, sender });
    
  

    e.preventDefault();
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success===false) {
        console.log(data);
        return;
      }
      setFormData({ ...formData, message: '' });
      
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form  onSubmit={handleSubmit}>
      <div className="">

      <div className='text-black   w-full flex'>
        <input
          type="text"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className=' outline-none bg-gray-50 p-1.5 w-full rounded-lg'
          placeholder="Type a message..."
          />
        <div className="text-right m-1 p-2 rounded-full bg-slate-200">
          <button type="submit" className='text-right text-blue-600'> <FiSend /></button>
          </div>
        </div>
      </div>
    </form>
  );
}
