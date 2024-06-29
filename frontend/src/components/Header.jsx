/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Header = () => {
    const user = useSelector((state) => state.user.currentUser);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.trim());
    setDropdownVisible(searchTerm !== '');
  };
  useEffect(() => {
    const fetchUsers = async () => {
      if (!searchTerm||searchTerm.length<1) {
          setDropdownVisible(false);
          return;
      }
      if (searchTerm) {
        const response = await fetch(`/api/user/search?searchTerm=${searchTerm}`);
        const data = await response.json();
        setProfiles(data);
        setDropdownVisible(true);
      }
    };
  
      fetchUsers();
  }, [searchTerm]);

  const dropdownRef = useRef(null);
  const handleClickOutside = (event) => {
      setDropdownVisible(false);
    
  };
  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-green-600 text-white py-4">
      <div className="container mx-auto flex justify-between items-center px-4">
        <h1 className="text-2xl font-bold">Social Media Site</h1>
          <div className="relative text-black mx-auto">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search profiles"
              className="px-2 py-1 rounded"
            />
           {dropdownVisible && (
              <ul className="absolute left-0 mt-2 w-full bg-white text-black shadow-lg rounded-md z-10 max-h-48 overflow-y-auto">
                {profiles.slice(0, 6).map(profile => (
                  <li key={profile._id} className="px-4 py-2 hover:bg-gray-200">
                    <Link to={`/profile/${profile._id}`} className="block">
                      {profile.firstName+' '+profile.lastName} <span className="text-gray-500">{profile.userName}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        <nav className="flex space-x-4 items-center">
          <Link to="/home" className="hover:text-gray-200">Home</Link>
          <Link to="/messages" className="hover:text-gray-200">Messages</Link>
          <Link to="/update-profile" className="hover:text-gray-200">Settings</Link>
          <Link to="/profile" className="hover:text-gray-200">
          
          <img src={user.avatar} alt="" className='w-8 h-8 rounded-full'/>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
