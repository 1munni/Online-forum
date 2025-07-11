import React from 'react';
import { Outlet, NavLink } from 'react-router'; 
const DasBoardLayout = () => {
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <div className="navbar bg-base-300 w-full lg:hidden">
          <div className="flex-none">
            <label htmlFor="my-drawer-2" aria-label="open sidebar" className="btn btn-square btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-6 w-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div className="mx-2 flex-1 px-2 lg:hidden">Dashboard</div>
          <div className="hidden flex-none lg:hidden">
            <ul className="menu menu-horizontal">
              {/* Navbar menu content here */}
              <li><a>Navbar Item 1x</a></li>
              <li><a>Navbar Item 2x</a></li>
            </ul>
          </div>
        </div>

        {/* ✅ Page content rendered here based on route */}
        <Outlet />
      </div>

      <div className="drawer-side">
        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
        
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
          {/* ✅ Sidebar links updated to use NavLink */}
          <li>
            <NavLink
              to="/dashboard/myPost"
              className={({ isActive }) =>
                isActive ? 'text-primary font-bold' : ''
              }
            >
              My Posts
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/profile"
              className={({ isActive }) =>
                isActive ? 'text-primary font-bold' : ''
              }
            >
              My Profile
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/addPost"
              className={({ isActive }) =>
                isActive ? 'text-primary font-bold' : ''
              }
            >
              Add Post
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DasBoardLayout;
