import React from 'react';
import { Outlet, NavLink } from 'react-router';
import Logo from '../Pages/Shared/Logo/Logo';
import useUserRole from '../Hooks/useUserRole';
// Import necessary icons from react-icons/fa
import { FaUser, FaClipboardList, FaPlusSquare, FaUserShield, FaUsers, FaBullhorn, FaFlag, FaBars } from 'react-icons/fa';


const DasBoardLayout = () => {
    const { role, isRoleLoading } = useUserRole();
    // console.log(role);

    // Close drawer on link click (mobile)
    const closeDrawer = () => {
        const drawerToggle = document.getElementById('my-drawer-2');
        if (drawerToggle && drawerToggle.checked) {
            drawerToggle.checked = false;
        }
    };

    // Define common NavLink styling for consistent look
    const navLinkClasses = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-medium transition-all duration-200 ease-in-out
         ${isActive
            ? 'bg-indigo-600 text-white shadow-md' // Active state: strong indigo background, white text, shadow
            : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-700' // Inactive state: subtle hover
        }`;

    return (
        <div className="drawer lg:drawer-open bg-gray-100 min-h-screen">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

            {/* Main content */}
            <div className="drawer-content flex flex-col">
                {/* Navbar (only shows on small screens) - Enhanced Styling */}
                <div className="navbar bg-white shadow-md w-full lg:hidden p-4">
                    <div className="flex-none">
                        <label htmlFor="my-drawer-2" className="btn btn-square btn-ghost text-gray-700">
                            <FaBars className="h-6 w-6" />
                        </label>
                    </div>
                    <div className="flex-1 px-4 text-xl font-bold text-gray-800">Dashboard</div>
                </div>

                {/* Route-rendered page content */}
                <div className="p-4 sm:p-6 lg:p-8 flex-grow">
                    <Outlet />
                </div>
            </div>

            {/* Sidebar - Enhanced Styling */}
            <div className="drawer-side z-20">
                <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
                <ul className="menu bg-white text-base-content min-h-full w-72 p-6 space-y-3 shadow-xl border-r border-gray-100">
                    <li className="mb-6">
                        <Logo />
                    </li>

                    {/* User Navigation Links */}
                    {!isRoleLoading && role === 'user' && (
                        <>
                            <li>
                                <NavLink
                                    to="/dashboard/myPost"
                                    className={navLinkClasses}
                                    onClick={closeDrawer}
                                >
                                    <FaClipboardList className="text-xl" /> My Posts
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/dashboard/profile"
                                    className={navLinkClasses}
                                    onClick={closeDrawer}
                                >
                                    <FaUser className="text-xl" /> My Profile
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/dashboard/addPost"
                                    className={navLinkClasses}
                                    onClick={closeDrawer}
                                >
                                    <FaPlusSquare className="text-xl" /> Add Post
                                </NavLink>
                            </li>
                        </>
                    )}

                    {/* Admin Navigation Links */}
                    {!isRoleLoading && role === 'admin' && (
                        <>
                            <li>
                                <NavLink
                                    to="/dashboard/adminProfile"
                                    className={navLinkClasses}
                                    onClick={closeDrawer}
                                >
                                    <FaUserShield className="text-xl" /> Admin Profile
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/dashboard/makeAdmin"
                                    className={navLinkClasses}
                                    onClick={closeDrawer}
                                >
                                    <FaUsers className="text-xl" /> Manage Users
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/dashboard/makeAnnouncement"
                                    className={navLinkClasses}
                                    onClick={closeDrawer}
                                >
                                    <FaBullhorn className="text-xl" /> Make Announcement
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/dashboard/reportComments"
                                    className={navLinkClasses}
                                    onClick={closeDrawer}
                                >
                                    <FaFlag className="text-xl" /> Reported Comments
                                </NavLink>
                            </li>
                        </>
                    )}
                    {/* Removed the Home link and the divider */}
                </ul>
            </div>
        </div>
    );
};

export default DasBoardLayout;