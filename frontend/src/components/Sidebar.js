import React from 'react';
import { FaHome, FaUserFriends, FaBell, FaEnvelope, FaCog } from 'react-icons/fa';
import { Link } from 'react-router-dom';
const Sidebar = () => {
    return (
        <div className="h-screen lg:w-64 w-16 bg-gray-800 text-white flex flex-col relative">
            <div className="flex items-center justify-center h-20 border-b border-gray-700">
                <h1 className="text-2xl font-bold hidden lg:block">SocialApp</h1>
            </div>
            <div className="flex-grow">
                <nav className="mt-10">
                    <SidebarItem icon={<FaHome />} text="Home" />
                    <SidebarItem icon={<FaUserFriends />} text="Friends" />
                    <SidebarItem icon={<FaBell />} text="Notifications" />
                    <Link to="/messages">
                    <SidebarItem icon={<FaEnvelope />} text="Messages" />
                    </Link>
                    <SidebarItem icon={<FaCog />} text="Settings" />
                </nav>
            </div>
        </div>
    );
};

const SidebarItem = ({ icon, text }) => (
    <div className="flex items-center py-3 px-6 hover:bg-gray-700 cursor-pointer">
        <div className="text-xl">{icon}</div>
        <span className="ml-4 text-md hidden lg:block">{text}</span>
    </div>
);

export default Sidebar;
