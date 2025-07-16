import { useEffect } from 'react';
import axios from 'axios';

import { useNavigate } from 'react-router'; 
import useAuth from './useAuth';

// ✅ Create a secure Axios instance
const axiosSecure = axios.create({
  baseURL: 'https://assignment-12-serversite-sooty.vercel.app/',
});

const useAxiosSecure = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Request interceptor: attach Authorization header
    const requestInterceptor = axiosSecure.interceptors.request.use(
      (config) => {
        if (user?.accessToken) {
          config.headers.Authorization = `Bearer ${user.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // ✅ Response interceptor: handle 401 and 403 errors
    const responseInterceptor = axiosSecure.interceptors.response.use(
      (res) => res,
      (error) => {
        const status = error.response?.status;

        if (status === 403) {
          navigate('/forbidden');
        } else if (status === 401) {
          logOut()
            .then(() => {
              navigate('/signin');
            })
            .catch(() => {});
        }

        return Promise.reject(error);
      }
    );

    // ✅ Cleanup interceptors on unmount
    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [user, logOut, navigate]);

  return axiosSecure;
};

export default useAxiosSecure;
