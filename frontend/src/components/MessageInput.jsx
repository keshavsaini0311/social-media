/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';

export default function MessageInput({ recipientId }) {
  const [formData, setFormData] = useState({
    message: '',
    recipientId: recipientId,
  });
  console.log(formData);
  const handleSubmit = async (e) => {
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
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className='text-black w-full flex'>
        <input
          type="text"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className='w-full outline-none bg-transparent py-1.5'
          placeholder="Type a message..."
        />
        <div className="text-right w-full">
          <button type="submit" className='text-right'>Send</button>
        </div>
      </div>
    </form>
  );
}
