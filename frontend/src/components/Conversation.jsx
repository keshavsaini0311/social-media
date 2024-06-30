/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'

export default function Conversation(conversation,lastmessage) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
    useEffect(() => {
      const fetchUser = async () => {
      try{
        setLoading(true)
        const res = await fetch(`/api/user/${conversation.conversation}`);
        const data=await res.json();
        if(data.success===false){
          setLoading(false)
          setError(data.message)
          return
        }
        setUser(data)
        setLoading(false)
      }
      catch(error){
        setLoading(false)
        setError(error.message)
      }
    }
    fetchUser()
    }, [conversation])
  return (

    <div>
      {loading && <div>Loading...</div>}
      
      {user &&  
        <div className=" p-4 ml-5 w-1/3 border-green-900 rounded-l-lg bg-green-200 hover:bg-green-100 hover:cursor-pointer">
          <div className="flex gap-2">
            <img src={user.avatar} alt="profile pic" className='rounded-full w-6 h-6'/>
          
            <h1>{user.firstName} {user.lastName}</h1>
          </div>
          <p>@{user.userName}</p>
          <p className='text-sm text-gray-600'>{conversation.lastmessage}</p>
        </div>}
    </div>
  )
}
