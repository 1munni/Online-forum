import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { useState } from 'react';
import { format } from 'date-fns';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';

const ReportedCommentsPage = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const [selectedComment, setSelectedComment] = useState(null); // State to hold the full comment object for the modal

    const { data: reportedComments = [], isLoading, error } = useQuery({
        queryKey: ['reportedComments'],
        queryFn: async () => {
            const res = await axiosSecure.get('/admin/reported-comments');
            return res.data;
        }
    });

    const approveCommentMutation = useMutation({
        mutationFn: async (commentId) => {
            const res = await axiosSecure.patch(`/admin/comments/${commentId}/approve`);
            return res.data;
        },
        onSuccess: () => {
            Swal.fire({
                title: 'Approved!',
                text: 'Comment report has been dismissed.',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });
            queryClient.invalidateQueries(['reportedComments']);
        },
        onError: (err) => {
            console.error('Error approving comment:', err);
            Swal.fire(
                'Error',
                err.response?.data?.error || 'Failed to approve comment.',
                'error'
            );
        }
    });

    const deleteCommentMutation = useMutation({
        mutationFn: async (commentId) => {
            const res = await axiosSecure.delete(`/admin/comments/${commentId}`);
            return res.data;
        },
        onSuccess: () => {
            Swal.fire({
                title: 'Deleted!',
                text: 'Comment has been permanently deleted.',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });
            queryClient.invalidateQueries(['reportedComments']);
        },
        onError: (err) => {
            console.error('Error deleting comment:', err);
            Swal.fire('Error', err.response?.data?.error || 'Failed to delete comment.', 'error');
        }
    });

    const handleApprove = async (commentId) => {
        const { isConfirmed } = await Swal.fire({
            title: 'Are you sure?',
            text: "You are about to dismiss this report and approve the comment.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, approve it!',
            cancelButtonText: 'No, cancel',
            customClass: {
                confirmButton: 'px-4 py-2 rounded-lg font-semibold bg-green-500 hover:bg-green-600 text-white',
                cancelButton: 'px-4 py-2 rounded-lg font-semibold bg-gray-500 hover:bg-gray-600 text-white'
            },
            buttonsStyling: false
        });

        if (isConfirmed) {
            approveCommentMutation.mutate(commentId);
        }
    };

    const handleDelete = async (commentId) => {
        const { isConfirmed } = await Swal.fire({
            title: 'Are you sure?',
            text: "You are about to permanently delete this comment. This action cannot be undone.",
            icon: 'error',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel',
            customClass: {
                confirmButton: 'px-4 py-2 rounded-lg font-semibold bg-red-500 hover:bg-red-600 text-white',
                cancelButton: 'px-4 py-2 rounded-lg font-semibold bg-gray-500 hover:bg-gray-600 text-white'
            },
            buttonsStyling: false
        });

        if (isConfirmed) {
            deleteCommentMutation.mutate(commentId);
        }
    };

    // --- Start of Design Updates (No Logic/Functionality Changes below this point) ---

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
                <span className="loading loading-dots loading-lg text-indigo-600"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-200px)] text-red-600 font-medium">
                <p>Error loading comments: {error.message}</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            {/* Page Title Section - Font weight changed from extrabold to bold */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 rounded-2xl shadow-xl mb-8 text-center">
                <h2 className="text-3xl md:text-4xl font-bold break-words"> {/* Changed font-extrabold to font-bold */}
                    Reported Comments Overview
                </h2>
                <p className="text-lg font-medium opacity-90 mt-2">
                    Review and manage reported user comments.
                </p>
            </div>

            {reportedComments.length === 0 ? (
                <div className="bg-white shadow-lg rounded-xl p-8 text-center text-gray-600 text-lg flex flex-col items-center justify-center min-h-[200px]">
                    <p className="mb-4">No comments currently reported. All clear!</p>
                </div>
            ) : (
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
                    {/* The div below with overflow-x-auto ensures horizontal scrolling */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[150px]">
                                        Commenter Email
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[250px]">
                                        Comment
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[120px]">
                                        Report Feedback
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[180px] hidden md:table-cell">
                                        Original Post
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[140px] hidden lg:table-cell">
                                        Reported At
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[180px]">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {reportedComments.map((comment) => {
                                    return (
                                        <tr key={comment._id} className="hover:bg-gray-50 transition-colors duration-150 align-top">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900 break-words"> {/* Added break-words */}
                                                {comment.userEmail}
                                            </td>
                                            <td className="px-6 py-4 max-w-xs text-gray-700">
                                                <p className="text-sm line-clamp-2 leading-relaxed">
                                                    {comment.commentText}
                                                </p>
                                                {comment.commentText.length > 50 && (
                                                    <button
                                                        onClick={() => setSelectedComment(comment)}
                                                        className="mt-1 text-indigo-600 hover:text-indigo-800 text-xs font-semibold transition-colors duration-200"
                                                    >
                                                        Read More
                                                    </button>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-semibold text-red-600 break-words"> {/* Added break-words */}
                                                {comment.feedback}
                                            </td>
                                            <td className="px-6 py-4 break-words text-sm text-gray-700 hidden md:table-cell">
                                                {comment.postTitle || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 hidden lg:table-cell">
                                                {comment.reportedAt ? format(new Date(comment.reportedAt), 'MMM dd, yyyy HH:mm') : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex flex-col sm:flex-row sm:justify-center sm:items-center gap-2">
                                                    <button
                                                        onClick={() => handleApprove(comment._id)}
                                                        className={`inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white transition-colors duration-200
                                                            ${approveCommentMutation.isLoading && approveCommentMutation.variables === comment._id
                                                                ? 'bg-gray-400 cursor-not-allowed'
                                                                : 'bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                                                            }`}
                                                        disabled={approveCommentMutation.isLoading || deleteCommentMutation.isLoading}
                                                    >
                                                        {approveCommentMutation.isLoading && approveCommentMutation.variables === comment._id ? (
                                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                        ) : (
                                                            'Approve'
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(comment._id)}
                                                        className={`inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white transition-colors duration-200
                                                            ${deleteCommentMutation.isLoading && deleteCommentMutation.variables === comment._id
                                                                ? 'bg-gray-400 cursor-not-allowed'
                                                                : 'bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                                                            }`}
                                                        disabled={approveCommentMutation.isLoading || deleteCommentMutation.isLoading}
                                                    >
                                                        {deleteCommentMutation.isLoading && deleteCommentMutation.variables === comment._id ? (
                                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                        ) : (
                                                            'Delete'
                                                        )}
                                                    </button>
                                                </div>
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
            {selectedComment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 px-4 py-6 animate-fade-in">
                    <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-lg shadow-xl p-8 transform transition-all duration-300 scale-100 opacity-100 animate-scale-in">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Full Comment Text</h3>
                        <p className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap mb-6">
                            {selectedComment.commentText}
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

export default ReportedCommentsPage;