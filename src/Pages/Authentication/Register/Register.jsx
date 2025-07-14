import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router';
import SocialLogIn from '../SocialLogin/SocialLogIn';
import axios from 'axios';
import {useState} from 'react';
import useAxios from '../../../Hooks/useAxios';
import useAuth from '../../../Hooks/useAuth';

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { createUser, updateUserProfile } = useAuth();
  const[profilePic, SetProfilePic]=useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';
const axiosInstance=useAxios();


   const onSubmit=data=>{
        console.log(data)
        // console.log(createUser);
        createUser(data.email, data.password)
        .then(async result=>{
            console.log(result.user)

// update userinfo in the database
const userInfo={
    email: data.email,
    username: data.username,
    role:'user',//default value
    badge: 'bronze',
    created_at:new Date().toISOString(),
    last_log_in:new Date().toISOString(),
}

const userRes=await axiosInstance.post('/users',userInfo)
console.log(userRes.data);

// update user profile in firebase
const userProfile={
    displayName:data.name,
    photoURL:profilePic
}
updateUserProfile(userProfile)
.then(()=>{
    console.log('profile name pic updated')
    navigate(from);
})
.catch(error=>{
    console.log(error)
})

        })
        .catch(error=>{
            console.error(error)
        })
    }

  const handleImageUpload=async(e)=>{
    const image=e.target.files[0];
    console.log(image)
    const formData=new FormData();
    formData.append('image', image);
    const imageUploadUrl=`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`
    const res = await axios.post(imageUploadUrl,
      formData)
      SetProfilePic(res.data.data.url)

  }

  return (
    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
      <div className="card-body">
        <h1 className="text-5xl font-medium">Please Create account!</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="fieldset">

            {/* Name */}
            <label className="label">Your Name</label>
            <input
              type="text"
              {...register('name', { required: true })}
              className="input"
              placeholder="Your Name"
            />
            {errors.name?.type === 'required' && (
              <p className='text-red-500'>Name is required</p>
            )}
            {/* photo */}
            <label className="label">Your Photo</label>
            <input
              type="file"
          onChange={handleImageUpload}
              className="input"
              placeholder="Your Profile Picture"
            />
         

            {/* Email */}
            <label className="label">Email</label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="input"
              placeholder="Email"
            />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}

            {/* Password */}
            <label className="label">Password</label>
            <input
              type="password"
              {...register('password', {
                required: true,
                minLength: 6
              })}
              className="input"
              placeholder="Password"
            />
            {errors.password?.type === "required" && (
              <p className='text-red-400'>Password is required</p>
            )}
            {errors.password?.type === "minLength" && (
              <p className='text-red-400'>Password must be at least 6 characters</p>
            )}

            <div>
              <a className="link link-hover">Forgot password?</a>
            </div>

            <button className="btn btn-primary text-black mt-4">Register</button>
          </fieldset>

          <p>
            <small>
              Already have an account?{" "}
              <Link state={{ from }} className='btn btn-link text-black' to='/signin'>
                Sign In
              </Link>
            </small>
          </p>
        </form>

        {/* ✅ Google Login Also Saves Bronze User */}
        <SocialLogIn />
      </div>
    </div>
  );
};

export default Register;
