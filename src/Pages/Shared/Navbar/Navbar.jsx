import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { FaBell } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import Logo from "../Logo/Logo";
import useAuth from "../../../Hooks/useAuth";


const Navbar = () => {
  const {user,logOut} = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleLogout = async () => {
console.log("Logout clicked"); 
await logOut();              
navigate('/signin');      
setIsDropdownOpen(false);  
};

  const navLinks = (
    <>
      <li><NavLink to="/" className="btn btn-ghost text-base">Home</NavLink></li>
      <li><NavLink to="/membership" className="btn btn-ghost text-base">Membership</NavLink></li>
      <li>
        <button className="btn btn-ghost text-base">
          <FaBell className="text-xl" />
        </button>
      </li>
      {/* {!user && (
        <li>
          <Link to="/signin" className="btn btn-primary text-sm px-4 py-2">Join Us</Link>
        </li>
      )} */}
    </>
  );

  return (
    <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50">
      <div className="navbar-start">
        <div className="dropdown">
          <button tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round"
                strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </button>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52 z-50"
          >
            {navLinks}
          </ul>
        </div>
        <Logo />
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 items-center gap-1">
          {navLinks}
        </ul>
      </div>

      <div className="navbar-end">
        {user ?
       (      <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center gap-2"
            >
              <img
                src={user.photoURL || "https://i.ibb.co/2nzwxcG/default-user.png"}
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-primary"
              />
              <IoIosArrowDown className="text-lg text-gray-600" />
            </button>
           {isDropdownOpen && (
  <div className="dropdown-content ...">
    <div className="p-2">{user?.displayName}</div>
    <Link to="/dashboard" className="p-2 hover:bg-gray-100">Dashboard</Link>
<button onClick={handleLogout} className="p-2 text-left hover:bg-gray-100 w-full">Logout</button> 
  </div>
)}
 </div> )
        
  :
   (<li>
    <Link to="/signin" className="btn btn-primary text-sm px-4 py-2">Join Us</Link>
    </li>)}
      </div>
    </div>
  );
};

export default Navbar;
