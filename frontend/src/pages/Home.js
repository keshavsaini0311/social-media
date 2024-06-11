import React from 'react'
import { useSelector } from 'react-redux'
import Sidebar from '../components/Sidebar';


const Home = () => {

    const {currentUser}= useSelector((state)=>state.user)
    console.log(currentUser.user);

    return (
        <div className="flex flex-grow">
            <Sidebar className="h-screen lg:w-64 w-16 bg-gray-800 text-white flex flex-col fixed lg:relative"/>
            Home 
        </div>
    )
}

export default Home

