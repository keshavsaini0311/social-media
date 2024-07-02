/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import Header from '../components/Header';
import { useSelector } from 'react-redux'
const ProfilePage = () => {
    const params=useParams()
    const {currentUser}=useSelector((state)=>state.user)
    const [user, setUser] = useState({});
    const[loading,setLoading]=useState(true)
    const[error,setError]=useState(false)

    useEffect(() => {
        const fetchUser = async () => {
          try {
            const res = await fetch(`/api/user/${params.id}`);
            const data = await res.json();
            if (data.success === false) {
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
      }, [params.id,user ]);

      const followUser = async () => {
        try {
          const message=`${currentUser.userName} ${user.followers.includes(currentUser._id)?'Unfollowed':'Followed'} ${user.userName}`
          const res = await fetch(`/api/messages/`, {
            method: 'POST',
            body: JSON.stringify({ recipientId: user._id,message:message }),
            headers: { 'Content-Type': 'application/json' },
            credentials: 'same-origin',
          });
          const data = await res.json();
          if (data.success === false) {
            console.log(data.message);
            return;
          }
          console.log(data);
        } catch (error) {
          console.log(error.message);
          }
        try {

          const res = await fetch(`/api/user/follow/${user._id}`, {
            method: 'POST',
            credentials: 'same-origin',
          });
          const data = await res.json();
          if (data.success === false) {
            console.log(data.message);
            return;
          }
          console.log(data);
        } catch (error) {
          console.log(error.message);
        }
      }


  return (
    <>
    {loading ? (
      <div>Loading...</div>
    ) : error ? (
      <div>Error</div>
    ) : (
      <>
      <Header/>
      <div className="bg-gray-100 min-h-screen flex flex-col items-center">
      <div className="bg-white shadow-md rounded-lg w-11/12 mt-10 p-6">
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
            <div className="flex flex-col">

            <div className="flex gap-3 mx-auto">

            <div className="text-center">
              <p className="text-gray-600">Followers</p>
              <p className="text-xl font-bold">{user.followers.length}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600">Following</p>
              <p className="text-xl font-bold">{user.following.length}</p>
            </div>
            </div>
          
            {currentUser?._id!==user._id &&(
            <div className="m-2 gap-3 mx-auto">
            <button onClick={followUser}  className= {`w-30 bg-green-500 hover:bg-lime-500 text-white font-bold py-2 px-4 rounded`}>
              {
                user.followers.includes(currentUser._id) ? "Unfollow" : "Follow"
              }
            </button>
            {
              user.followers.includes(currentUser._id) ? (
                <button className="m-3 w-30 bg-green-500 hover:bg-lime-500 text-white font-bold py-2 px-4 rounded">
                  Message
                </button>
              ) : null
            }  
            </div>
            )     
            } 
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
    )}
    </>
  );
};

export default ProfilePage;
