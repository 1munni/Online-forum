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

  const { data: posts = [], isLoading, isError } = useQuery({
    queryKey: ['userPosts', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/posts?email=${user.email}`);
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (postId) => {
      await axiosSecure.delete(`/posts/${postId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userPosts', user?.email]);
    },
  });

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

const handleComment = (postId) => {
  navigate(`/dashboard/comments/${postId}`);
};

  if (isLoading) return <div className="text-center py-10">Loading posts...</div>;
  if (isError) return <div className="text-center py-10 text-red-500">Failed to load posts.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-semibold mb-6">My Posts</h2>

      {posts.length === 0 ? (
        <p>You haven't posted anything yet.</p>
      ) : (
        // ✅ Responsive wrapper for horizontal scroll
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">Post Title</th>
                <th className="border border-gray-300 px-4 py-2 text-center hidden sm:table-cell">
                  Votes
                </th>
                <th className="border border-gray-300 px-4 py-2 text-center">Comments</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Delete</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">
                    <div className="text-sm font-medium">{post.title}</div>
                    {/* ✅ Mobile view: show vote count inside title */}
                    <div className="sm:hidden text-xs text-gray-500 mt-1">
                      Votes: {(post.upVote || 0) - (post.downVote || 0)}
                    </div>
                  </td>

                  {/* ✅ Hidden on small screens */}
                  <td className="border border-gray-300 px-4 py-2 text-center hidden sm:table-cell">
                    {(post.upVote || 0) - (post.downVote || 0)}
                  </td>

                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button
                      onClick={() => handleComment(post._id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Comments
                    </button>
                  </td>

                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyPosts;
