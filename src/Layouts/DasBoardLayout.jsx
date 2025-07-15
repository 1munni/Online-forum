import React from 'react';
import { Outlet, NavLink } from 'react-router'; 
import Logo from '../Pages/Shared/Logo/Logo';
import useUserRole from '../Hooks/useUserRole';


const DasBoardLayout = () => {
const{role, isRoleLoading}=useUserRole();
console.log(role);

  // Close drawer on link click (mobile)
  const closeDrawer = () => {
    const drawerToggle = document.getElementById('my-drawer-2');
    if (drawerToggle && drawerToggle.checked) {
      drawerToggle.checked = false;
    }
  };

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

      {/* Main content */}
      <div className="drawer-content flex flex-col">
        {/* Navbar (only shows on small screens) */}
        <div className="navbar bg-base-300 w-full lg:hidden">
          <div className="flex-none">
            <label htmlFor="my-drawer-2" className="btn btn-square btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </label>
          </div>
          <div className="flex-1 px-4 text-lg font-semibold">Dashboard</div>
        </div>

        {/* Route-rendered page */}
        <Outlet />
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-72 p-4 space-y-2">
          <li>
            <Logo />
          </li>

          {
            !isRoleLoading && role === 'user' &&(
              <>
          <li>
            <NavLink
              to="/dashboard/myPost"
              className={({ isActive }) => isActive ? 'text-primary font-bold' : ''}
              onClick={closeDrawer}
            >
              My Posts
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/profile"
              className={({ isActive }) => isActive ? 'text-primary font-bold' : ''}
              onClick={closeDrawer}
            >
              My Profile
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/addPost"
              className={({ isActive }) => isActive ? 'text-primary font-bold' : ''}
              onClick={closeDrawer}
            >
              Add Post
            </NavLink>
          </li>
              </>
            )
          }


      {!isRoleLoading && role === 'admin' && (
  <>
    <li>
      <NavLink
        to="/dashboard/adminProfile"
        className={({ isActive }) => isActive ? 'text-primary font-bold' : ''}
        onClick={closeDrawer}
      >
        Admin Profile
      </NavLink>
    </li>
    <li>
      <NavLink
        to="/dashboard/makeAdmin"
        className={({ isActive }) => isActive ? 'text-primary font-bold' : ''}
        onClick={closeDrawer}
      >
        Manage User
      </NavLink>
    </li>
    <li>
      <NavLink
        to="/dashboard/makeAnnouncement"
        className={({ isActive }) => isActive ? 'text-primary font-bold' : ''}
        onClick={closeDrawer}
      >
        Make Announcement
      </NavLink>
    </li>
    <li>
      <NavLink
        to="/dashboard/reportComments"
        className={({ isActive }) => isActive ? 'text-primary font-bold' : ''}
        onClick={closeDrawer}
      >
       Report Comments
      </NavLink>
    </li>
  </>
)}

        </ul>
      </div>
    </div>
  );
};

export default DasBoardLayout;
