import React from 'react';
import useAuth from '../Hooks/useAuth';
import useUserRole from '../Hooks/useUserRole';
import { Navigate } from 'react-router';

const AdminRoutes = ({children}) => {
    const {user,loading}=useAuth();
    const{role, isRoleLoading}=useUserRole();

    if (loading || isRoleLoading){
    return <span className="loading loading-ring loading-xl"></span>
}

if(!user || role!== 'admin'){
   return <Navigate state={{from:location.pathname}} to='/forbidden'></Navigate>
}
    return children
};

export default AdminRoutes;