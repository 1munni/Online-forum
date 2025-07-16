import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router"; 
import Swal from "sweetalert2";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const MyPosts = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch user-specific posts
  const {
    data: posts = [],
    isLoading,
    isError,
    error, // Capture error object for more detail
  } = useQuery({
    queryKey: ["userPosts", user?.email],
    enabled: !!user?.email, // Only run query if user email is available
    queryFn: async () => {
      const res = await axiosSecure.get(`/posts?email=${user.email}`);
      return res.data;
    },
  });

  // Mutation for deleting a post
  const deleteMutation = useMutation({
    mutationFn: async (postId) => {
      await axiosSecure.delete(`/posts/${postId}`);
    },
    onSuccess: () => {
      // Invalidate and refetch user posts after successful deletion
      queryClient.invalidateQueries(["userPosts", user?.email]);
      Swal.fire({
        title: "Deleted!",
        text: "Your post has been deleted.",
        icon: "success",
        timer: 1500, // Auto-close after 1.5 seconds
        showConfirmButton: false
      });
    },
    onError: (mutationError) => {
      console.error("Error deleting post:", mutationError);
      Swal.fire({
        title: "Error!",
        text: "Failed to delete post. Please try again.",
        icon: "error",
      });
    }
  });

  // Handle delete confirmation
  const handleDelete = (postId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444", // Tailwind red-500
      cancelButtonColor: "#6B7280", // Tailwind gray-500
      confirmButtonText: "Yes, delete it!",
      customClass: {
        confirmButton: 'px-4 py-2 rounded-lg font-semibold',
        cancelButton: 'px-4 py-2 rounded-lg font-semibold'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(postId);
      }
    });
  };

  // Handle navigation to comments page
  const handleComment = (postId) => {
    navigate(`/dashboard/comments/${postId}`);
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <span className="loading loading-dots loading-lg text-indigo-600"></span>
      </div>
    );
  if (isError)
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] text-red-600 font-medium">
        <p>Error loading posts: {error?.message || "Unknown error"}</p>
      </div>
    );
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] text-gray-600">
        Please log in to view your posts.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-4xl font-extrabold text-gray-800 mb-8 text-center md:text-left">
        My Forum Posts
      </h2>

      {posts.length === 0 ? (
        <div className="bg-white shadow-lg rounded-xl p-8 text-center text-gray-600 text-lg flex flex-col items-center justify-center min-h-[200px]">
          <p className="mb-4">You haven't posted anything yet.</p>
          <Link to="/add-post" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-200">
            Create Your First Post
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-indigo-50"> {/* Light indigo header background */}
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                    Post Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-indigo-700 uppercase tracking-wider hidden sm:table-cell">
                    Votes
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                    Comments
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {posts.map((post) => (
                  <tr key={post._id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 line-clamp-1">{post.title}</div>
                      <div className="sm:hidden text-xs text-gray-500 mt-1">
                        Votes: {(post.upVote || 0) - (post.downVote || 0)}
                      </div>
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {post.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-700 hidden sm:table-cell">
                      {(post.upVote || 0) - (post.downVote || 0)}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleComment(post._id)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                      >
                        View Comments ({post.commentCount || 0})
                      </button>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <button
                        onClick={() => handleDelete(post._id)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPosts;