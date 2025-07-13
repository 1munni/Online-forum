import React, { Children } from 'react';

import { Navigate, useLocation, useNavigate } from 'react-router';
import useAuth from '../Hooks/useAuth';

const PrivateRoutes = ({children}) => {
const{ user,loading}=useAuth();
const location=useLocation();
// console.log(location)

if (loading){
    return <span className="loading loading-ring loading-xl"></span>
}

if(!user){
   return <Navigate state={{from:location.pathname}} to='/signin'></Navigate>
}
    return children;
   
};

export default PrivateRoutes;