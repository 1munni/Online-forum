import React from 'react';
import Lottie from 'lottie-react';
import signinLottie from '../assets/lotties/signIn (2).json'
import { Outlet } from 'react-router';
import Logo from '../Pages/Shared/Logo/Logo';

const AuthLayout = () => {
    return (
       <div className=" p-12 bg-base-200 m-10 rounded-3xl">
      <div>
          <Logo></Logo>
      </div>
  <div className="hero-content flex-col lg:flex-row-reverse">
   <div className='flex-1'>
     <Lottie animationData={signinLottie} loop={true} />
   </div>
    <div className='flex-1'>
     <Outlet></Outlet>
    </div>
  </div>
</div>
    );
};

export default AuthLayout;