import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';

const MyPosts = () => {
   const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch posts by logged-in user
  const { data: posts = [], isLoading, isError } = useQuery({
    queryKey: ['userPosts', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/posts?email=${user.email}`);
      return res.data;
    },
  });

  // Delete post mutation
  const deleteMutation = useMutation(
    {
   mutationFn:   async (postId) => {
      await axiosSecure.delete(`/posts/${postId}`);
    },
    
      onSuccess: () => {
        queryClient.invalidateQueries(['userPosts', user?.email]);
      },
    
    }
  );

  // Handle delete with SweetAlert2 confirmation
  const handleDelete = (postId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(postId);
        Swal.fire('Deleted!', 'Your post has been deleted.', 'success');
      }
    });
  };

  // Handle comment button redirect
  const handleComment = (postId) => {
    navigate(`/comments/${postId}`);
  };

  if (isLoading) return <div className="text-center py-10">Loading posts...</div>;
  if (isError) return <div className="text-center py-10 text-red-500">Failed to load posts.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-semibold mb-6">My Posts</h2>
      {posts.length === 0 ? (
        <p>You haven't posted anything yet.</p>
      ) : (
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Post Title</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Number of Votes</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Comments</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Delete</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(post => (
              <tr key={post._id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{post.title}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{(post.upVote || 0) - (post.downVote || 0)}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button
                    onClick={() => handleComment(post._id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Comments
                  </button>
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyPosts;
