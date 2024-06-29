/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import Header from '../components/Header';
const ProfilePage = () => {
    const params=useParams()
    const [user, setUser] = useState({});
    const[loading,setLoading]=useState(true)
    const[error,setError]=useState(false)

    useEffect(() => {
        const fetchUser = async () => {
          try {
            const res = await fetch(`/api/user/${params.id}`);
            const data = await res.json();
            if (data.error) {
              setError(true);
              setLoading(false);
              return;
            }
            setUser(data);
            setError(false);
            setLoading(false);
          } catch (error) {
            setError(true);
            setLoading(false);
          }
        };
        fetchUser();
      }, [ params.id ]);

    


  return (
    <>
    <Header/>
    <div className="bg-gray-100 min-h-screen flex flex-col items-center">
      <div className="bg-white shadow-md rounded-lg w-3/4 mt-10 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              className="h-24 w-24 rounded-full"
              src={user.avatar}
              alt="Profile"
            />
            <div className="ml-6">
              <h1 className="text-2xl font-bold">{user.firstName+" "+user.lastName}</h1>
              <p className="text-gray-600">@{user.userName}</p>
              <p className="text-gray-600">{user.bio}</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Posts</h2>
          <div className="bg-white shadow-md rounded-lg p-4 mb-4">
            <p className="text-gray-800">This is a sample post content.</p>
            <p className="text-gray-500 text-sm mt-2">Posted on June 28, 2024</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 mb-4">
            <p className="text-gray-800">Another sample post content.</p>
            <p className="text-gray-500 text-sm mt-2">Posted on June 27, 2024</p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default ProfilePage;
