import { useParams } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; // Import useMutation and useQueryClient
import Swal from 'sweetalert2';
import { useState } from 'react';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';

const CommentsPage = () => {
    const { postId } = useParams();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient(); // Initialize queryClient
    const [selectedComment, setSelectedComment] = useState(null);
    const [commentFeedback, setCommentFeedback] = useState({}); // State to hold selected feedback for each comment

    const { data: comments = [], isLoading } = useQuery({
        queryKey: ['comments', postId],
        queryFn: async () => {
            const res = await axiosSecure.get(`/comments/${postId}`);
            return res.data;
        }
    });

    // Use useMutation for reporting comments
    const reportCommentMutation = useMutation({
        mutationFn: async ({ commentId, feedback }) => {
            const res = await axiosSecure.patch(`/comments/report/${commentId}`, { feedback });
            return res.data;
        },
        onSuccess: (data, variables) => {
            Swal.fire('Reported!', 'Comment has been reported.', 'success');
            // Invalidate and refetch comments to update UI or update state directly
            queryClient.invalidateQueries(['comments', postId]);
            // Mark the comment as reported in local state
            setCommentFeedback(prev => ({
                ...prev,
                [variables.commentId]: 'reported' // Use a distinct value to indicate reported status
            }));
        },
        onError: (error) => {
            console.error('Error reporting comment:', error);
            Swal.fire('Error reporting comment', error.response?.data?.error || 'Something went wrong', 'error');
        }
    });

    const handleReport = async (commentId) => {
        const feedback = commentFeedback[commentId]; // Get the selected feedback for this specific comment

        if (!feedback || feedback === "Select Feedback") { // Check for empty or default feedback
            return Swal.fire('Select Feedback First', '', 'warning');
        }

        const { isConfirmed } = await Swal.fire({
            title: 'Report this comment?',
            text: `Reason: ${feedback}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, report it',
        });

        if (isConfirmed) {
            reportCommentMutation.mutate({ commentId, feedback });
        }
    };

    return (
        <div className="p-4 max-w-7xl mx-auto">
            <h2 className="text-xl md:text-2xl font-bold mb-4 break-words">
                Comments for Post ID:
                <span className="text-purple-600 block md:inline"> {postId}</span>
            </h2>

            {isLoading ? (
                <p className="text-center text-gray-500">Loading comments...</p>
            ) : comments.length === 0 ? (
                <p className="text-center text-gray-500">No comments found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table w-full text-sm md:text-base">
                        <thead className="bg-gray-100">
                            <tr>
                                <th>Email</th> {/* Changed from Username to Email */}
                                <th>Comment</th>
                                <th>Feedback</th>
                                <th>Report</th>
                            </tr>
                        </thead>
                        <tbody>
                            {comments.map((comment) => {
                                const shortText = comment.commentText.length > 30
                                    ? comment.commentText.slice(0, 30) + '...'
                                    : comment.commentText;

                                const isReported = commentFeedback[comment._id] === 'reported' || comment.reported; // Check if already reported

                                return (
                                    <tr key={comment._id} className="align-top">
                                        <td className="min-w-[120px]">{comment.userEmail}</td> {/* Display userEmail */}
                                        <td className="min-w-[200px]">
                                            {shortText}
                                            {comment.commentText.length > 30 && (
                                                <button
                                                    onClick={() => setSelectedComment(comment)}
                                                    className="ml-2 text-blue-600 underline text-xs"
                                                >
                                                    Read More
                                                </button>
                                            )}
                                        </td>
                                        <td className="min-w-[150px]">
                                            <select
                                                className="select select-sm select-bordered w-full"
                                                onChange={(e) =>
                                                    setCommentFeedback(prev => ({
                                                        ...prev,
                                                        [comment._id]: e.target.value,
                                                    }))
                                                }
                                                defaultValue=""
                                                disabled={isReported} // Disable select if already reported
                                            >
                                                <option disabled value="">
                                                    Select Feedback
                                                </option>
                                                <option>Spam</option>
                                                <option>Harassment</option>
                                                <option>Off-topic</option>
                                            </select>
                                        </td>
                                        <td className="min-w-[100px]">
                                            <button
                                                className="btn btn-sm btn-error text-white w-full"
                                                onClick={() =>
                                                    handleReport(comment._id)
                                                }
                                                disabled={isReported} // Disable button if already reported
                                            >
                                                {isReported ? 'Reported' : 'Report'}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Read More Modal */}
            {selectedComment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-4">
                    <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-lg">
                        <h3 className="text-lg font-semibold mb-2">Full Comment</h3>
                        <p className="text-gray-800">{selectedComment.commentText}</p>
                        <div className="mt-4 flex justify-end">
                            <button
                                className="btn btn-sm btn-outline"
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