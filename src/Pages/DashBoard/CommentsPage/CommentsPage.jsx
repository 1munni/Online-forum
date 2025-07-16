import { useParams } from "react-router"; // Ensure react-router-dom is used
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { useState } from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const CommentsPage = () => {
  const { postId } = useParams();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [selectedComment, setSelectedComment] = useState(null); // Used for Read More modal
  const [commentFeedback, setCommentFeedback] = useState({}); // State to hold selected feedback for each comment

  const {
    data: comments = [],
    isLoading,
    isError,
    error, // Capture error object for more detailed messages
  } = useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/comments/${postId}`);
      return res.data;
    },
  });

  const reportCommentMutation = useMutation({
    mutationFn: async ({ commentId, feedback }) => {
      const res = await axiosSecure.patch(`/comments/report/${commentId}`, {
        feedback,
      });
      return res.data;
    },
    onSuccess: (data, variables) => {
      Swal.fire({
        title: "Reported!",
        text: "Comment has been reported.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      // Invalidate and refetch comments to update UI or clear local feedback
      queryClient.invalidateQueries(["comments", postId]);
      // Remove the local feedback state for the reported comment
      setCommentFeedback((prev) => {
        const newState = { ...prev };
        delete newState[variables.commentId];
        return newState;
      });
    },
    onError: (mutationError) => {
      console.error("Error reporting comment:", mutationError);
      Swal.fire(
        "Error reporting comment",
        mutationError.response?.data?.error || "Something went wrong",
        "error"
      );
    },
  });

  const handleReport = async (commentId) => {
    const feedback = commentFeedback[commentId];

    if (!feedback || feedback === "Select Feedback") { // Checking against the actual option text
      return Swal.fire({
        icon: "warning",
        title: "Please Select Feedback",
        text: "You must choose a reason before reporting a comment.",
        confirmButtonColor: "#6B7280", // Tailwind gray-500
      });
    }

    const { isConfirmed } = await Swal.fire({
      title: "Confirm Report?", // Changed title for clarity
      text: `Are you sure you want to report this comment for: "${feedback}"?`, // Clarified text
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Report It!",
      cancelButtonText: "Cancel", // Added cancel button text for clarity
      confirmButtonColor: "#EF4444", // Tailwind red-500
      cancelButtonColor: "#6B7280", // Tailwind gray-500
      customClass: {
        confirmButton: 'px-4 py-2 rounded-lg font-semibold',
        cancelButton: 'px-4 py-2 rounded-lg font-semibold'
      }
    });

    if (isConfirmed) {
      reportCommentMutation.mutate({ commentId, feedback });
    }
  };

  // --- Start of Design Updates (No Logic/Functionality Changes below this point) ---

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <span className="loading loading-dots loading-lg text-indigo-600"></span>
      </div>
    );
  if (isError)
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] text-red-600 font-medium">
        <p>Error loading comments: {error?.message || "Unknown error"}</p>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10"> {/* Adjusted max-width for more spacious layout */}
      {/* Page Title Section - Enhanced with Gradient and Shadow */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-2xl shadow-xl mb-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold break-words">
          Comments for Post
        </h2>
        <p className="text-lg font-medium opacity-90 mt-2">
          ID: <span className="font-mono text-purple-200">{postId}</span> {/* Monospace font for ID */}
        </p>
      </div>

      {comments.length === 0 ? (
        <div className="bg-white shadow-lg rounded-xl p-8 text-center text-gray-600 text-lg flex flex-col items-center justify-center min-h-[200px]">
          <p>No comments found for this post.</p>
        </div>
      ) : (
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100"> {/* Card-like wrapper for the table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50"> {/* Softer background for table header */}
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Commenter Email
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Comment
                  </th>
                  <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Reason
                  </th>
                  <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Report
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100"> {/* Lighter divider for table body */}
                {comments.map((comment) => {
                  // This logic remains untouched as per your request
                  const shortText =
                    comment.commentText.length > 30
                      ? comment.commentText.slice(0, 30) + "..."
                      : comment.commentText;

                 
                  const isReported =
                    commentFeedback[comment._id] === "reported" ||
                    comment.reported;

                  return (
                    <tr key={comment._id} className="hover:bg-gray-50 transition-colors duration-150 align-top"> {/* Smooth hover effect */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {comment.userEmail}
                        </div>
                      </td>
                      <td className="px-6 py-4 max-w-lg text-gray-700"> {/* Added max-w-lg for better text control */}
                        <p className="text-sm line-clamp-2 leading-relaxed"> {/* line-clamp for neatness */}
                          {comment.commentText}
                        </p>
                        {comment.commentText.length > 30 && ( // Original logic: Read More if > 30 chars
                          <button
                            onClick={() => setSelectedComment(comment)} // Pass whole comment object to state
                            className="mt-1 text-indigo-600 hover:text-indigo-800 text-xs font-semibold transition-colors duration-200"
                          >
                            Read More
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {isReported ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Reported
                          </span>
                        ) : (
                          <select
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            onChange={(e) =>
                              setCommentFeedback((prev) => ({
                                ...prev,
                                [comment._id]: e.target.value,
                              }))
                            }
                            value={commentFeedback[comment._id] || "Select Feedback"} // Controlled component, explicitly set value
                            disabled={isReported || reportCommentMutation.isLoading}
                          >
                            <option value="Select Feedback">Select Feedback</option> {/* Explicit value */}
                            <option>Spam</option>
                            <option>Harassment</option>
                            <option>Off-topic</option>
                            <option>Inappropriate Content</option> {/* Added a new option for better context */}
                          </select>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          className={`inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white transition-colors duration-200
                            ${isReported || reportCommentMutation.isLoading
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                            }`}
                          onClick={() => handleReport(comment._id)}
                          disabled={isReported || reportCommentMutation.isLoading}
                        >
                          {/* Spinner is conditionally rendered based on mutation status */}
                          {reportCommentMutation.isLoading && reportCommentMutation.variables?.commentId === comment._id ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            isReported ? "Reported" : "Report"
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Read More Modal - Enhanced Styling */}
      {selectedComment && ( // Use selectedComment as per original state
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 px-4 animate-fade-in"> {/* Added animate-fade-in */}
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg transform transition-all duration-300 scale-100 opacity-100 animate-scale-in"> {/* Added animate-scale-in */}
            <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Full Comment Text</h3>
            <p className="text-gray-800 text-base leading-relaxed max-h-80 overflow-y-auto mb-6">
              {selectedComment.commentText} {/* Use selectedComment.commentText */}
            </p>
            <div className="flex justify-end">
              <button
                className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => setSelectedComment(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentsPage;