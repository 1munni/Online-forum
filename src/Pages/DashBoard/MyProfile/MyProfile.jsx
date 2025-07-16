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
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
                <span className="loading loading-dots loading-lg text-indigo-600"></span>
            </div>
        );
    }

    const isMember = dbUser?.membership === 'member';

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            {/* User Profile Card */}
            <div className="bg-white shadow-xl rounded-2xl p-8 mb-8 border border-gray-100 transform transition-all duration-300 hover:scale-[1.005]">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    <div className="relative">
                        <img
                            src={user?.photoURL || 'https://i.ibb.co/ZYW3VTp/brown-brim.png'}
                            alt="User Profile"
                            className="w-28 h-28 rounded-full object-cover border-4 border-indigo-400 shadow-md transform transition-transform duration-300 hover:scale-105"
                        />
                        {/* Member Status Indicator (Badge over image) */}
                        {isMember && (
                            <span
                                title="Gold Member"
                                className="absolute bottom-0 right-0 -mr-2 -mb-2 bg-yellow-500 text-white rounded-full p-2 text-xs flex items-center justify-center shadow-lg border-2 border-white"
                            >
                                <FaMedal className="text-lg" />
                            </span>
                        )}
                    </div>
                    <div className="text-center sm:text-left flex-grow">
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-1 leading-tight">
                            {user?.displayName || 'Forum User'}
                        </h2>
                        <p className="text-lg text-gray-600 font-medium mb-3">
                            {user?.email}
                        </p>

                        {/* Badges - Consolidated and Styled */}
                        <div className="flex justify-center sm:justify-start items-center gap-3 mt-4">
                            {isMember ? (
                                <span className="inline-flex items-center bg-yellow-400 text-yellow-900 px-4 py-2 text-sm font-semibold rounded-full shadow-md">
                                    <FaMedal className="mr-2 text-base" /> Gold Member
                                </span>
                            ) : (
                                <span className="inline-flex items-center bg-amber-500 text-white px-4 py-2 text-sm font-semibold rounded-full shadow-md">
                                    <FaMedal className="mr-2 text-base" /> Bronze Member
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Posts Section */}
            <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">
                    My Recent Posts
                </h3>
                {posts.length === 0 ? (
                    <div className="text-center text-gray-600 text-lg py-10">
                        <p className="mb-4">You haven't posted anything yet.</p>
                        <p className="text-indigo-600 hover:underline cursor-pointer">Start sharing your thoughts!</p>
                    </div>
                ) : (
                    // Changed from <ul> to <div> grid for card-like separation
                    <div className="grid grid-cols-1 gap-6"> {/* Each post will be a separate card with a gap */}
                        {posts.map(post => (
                            // Each post is now an individual div acting as a card
                            <div key={post._id} className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100 transform hover:scale-[1.005] transition-transform duration-200">
                                <h4 className="text-lg font-semibold text-gray-800 mb-2 leading-tight">{post.title}</h4>
                                {post.tags && post.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {post.tags.map((tag, i) => (
                                            <span
                                                key={i}
                                                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium uppercase tracking-wide"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <div className="text-sm text-gray-500 flex items-center justify-between">
                                    <span>Created: {new Date(post.createdAt).toLocaleString()}</span>
                                    <span className="flex items-center gap-3"> {/* Increased gap between votes */}
                                        <span className="text-gray-600 flex items-center gap-1">
                                            👍 <span className="font-medium">{post.upVote || 0}</span>
                                        </span>
                                        <span className="text-gray-600 flex items-center gap-1">
                                            👎 <span className="font-medium">{post.downVote || 0}</span>
                                        </span>
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyProfile;