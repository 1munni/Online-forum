import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router"; // ✅ fixed to react-router-dom
import { FaBell } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import Logo from "../Logo/Logo";
import useAuth from "../../../Hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const axiosSecure = useAxiosSecure();

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleLogout = async () => {
    await logOut();
    navigate("/signin");
    setIsDropdownOpen(false);
  };

  // ✅ Fetch announcement count
  const { data: announcements = [] } = useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const res = await axiosSecure.get("/announcements");
      return res.data;
    },
  });

  const navLinks = (
    <>
      <li><NavLink to="/" className="btn btn-ghost text-base">Home</NavLink></li>
      <li><NavLink to="/membership" className="btn btn-ghost text-base">Membership</NavLink></li>
      <li>
        <button className="btn btn-ghost text-base relative">
          <FaBell className="text-xl" />
          {announcements.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {announcements.length}
            </span>
          )}
        </button>
      </li>
    </>
  );

  return (
    <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50">
      {/* Start: Logo and Hamburger */}
      <div className="navbar-start">
        <div className="dropdown">
          <button tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16" />
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

      {/* Center nav on large screens */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 items-center gap-1">
          {navLinks}
        </ul>
      </div>

      {/* Right: User / Join */}
      <div className="navbar-end">
        {user ? (
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center gap-2 focus:outline-none"
            >
              <img
                src={user.photoURL || "https://i.ibb.co/2nzwxcG/default-user.png"}
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-primary"
              />
              <IoIosArrowDown className="text-lg text-gray-600" />
            </button>

            {/* Dropdown */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-50 text-sm">
                <div className="px-4 py-2 font-semibold border-b">{user?.displayName}</div>
                <Link
                  to="/dashboard"
                  className="block px-4 py-2 hover:bg-gray-100 transition"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/signin" className="btn btn-primary text-sm px-4 py-2">Join Us</Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
