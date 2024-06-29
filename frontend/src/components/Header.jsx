/* eslint-disable no-unused-vars */
import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Header = () => {
    const user=useSelector((state)=>state.user.currentUser)
  return (
    <header className="bg-green-600 text-white py-4">
      <div className="container mx-auto flex justify-between items-center px-4">
        <h1 className="text-2xl font-bold">Social Media Site</h1>
        <nav>
          <ul className="flex space-x-4">
            <li><Link to="/home" className="hover:text-gray-200">Home</Link></li>
            <li><Link to={`/profile/${user._id}`} className="hover:text-gray-200">Profile</Link></li>
            <li><Link to="/messages" className="hover:text-gray-200">Messages</Link></li>
            <li><Link to="/settings" className="hover:text-gray-200">Settings</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
