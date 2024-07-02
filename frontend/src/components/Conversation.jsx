/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';

export default function Conversation({ conversation, lastMessage }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/user/${conversation}`);
        const data = await res.json();
        if (data.success===false) {
          console.log(data.message);
          setLoading(false);
          return; 
        }
        setUser(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError(error.message);
      }
    };

    fetchUser();
  }, [conversation]);

  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {user && (
        <div className="p-4 ml-5 w-3/3 border-green-900 rounded-l-lg bg-green-200 hover:bg-green-100 hover:cursor-pointer">
          <div className="flex gap-2">
            <img src={user.avatar} alt="profile pic" className='rounded-full w-6 h-6' />
            <h1>{user.firstName} {user.lastName}</h1>
          </div>
          <p>@{user.userName}</p>
          {lastMessage && (
            
            <p className='text-sm text-gray-600'>
            {lastMessage.substring(0, 20)}{lastMessage.length > 20 && '...'}
          </p>
          )}
        </div>
      )}
    </div>
  );
}
