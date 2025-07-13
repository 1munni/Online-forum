import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { FaMedal } from 'react-icons/fa';
import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';

const MyProfile = () => {
   const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // Get user role from database
  const { data: dbUser = {}, isLoading: loadingUser } = useQuery({
    queryKey: ['dbUser', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data;
    },
  });

  // Get 3 latest posts by user
  const { data: posts = [], isLoading: loadingPosts } = useQuery({
    queryKey: ['userPosts', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/posts?email=${user.email}&limit=3`);
      return res.data;
    },
  });

  if (loadingUser || loadingPosts) {
    return <div className="text-center py-10">Loading profile...</div>;
  }

  const isMember = dbUser?.membership === 'member';


  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex items-center gap-4">
          <img
            src={user?.photoURL || 'https://i.ibb.co/ZYW3VTp/brown-brim.png'}
            alt="User"
            className="w-20 h-20 rounded-full border"
          />
          <div>
            <h2 className="text-2xl font-bold">{user?.displayName || 'User'}</h2>
            <p className="text-gray-600">{user?.email}</p>

            {/* Badges */}
            <div className="flex items-center gap-2 mt-2">
              {isMember ? (
                <span className="inline-flex items-center bg-yellow-300 text-yellow-900 px-2 py-1 text-sm font-semibold rounded">
                  <FaMedal className="mr-1" /> Gold Badge (Member)
                </span>
              ) : (
                <span className="inline-flex items-center bg-amber-500 text-white px-2 py-1 text-sm font-semibold rounded">
                  <FaMedal className="mr-1" /> Bronze Badge (Registered)
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">My Recent Posts</h3>
        {posts.length === 0 ? (
          <p>You haven't posted anything yet.</p>
        ) : (
          <ul className="space-y-4">
            {posts.map(post => (
              <li key={post._id} className="border-b pb-3">
                <h4 className="text-md font-medium">{post.title}</h4>
                <p className="text-sm text-gray-500">
                  Tags: {post.tags?.join(', ') || 'None'}
                </p>
                <div className="text-xs text-gray-400 mt-1">
                  Created: {new Date(post.createdAt).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
