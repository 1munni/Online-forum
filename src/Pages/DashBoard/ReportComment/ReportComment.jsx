import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { useState } from 'react';
import { format } from 'date-fns';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';

const ReportedCommentsPage = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const [selectedComment, setSelectedComment] = useState(null);

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
            Swal.fire('Approved!', 'Comment report has been dismissed.', 'success');
            queryClient.invalidateQueries(['reportedComments']);
        },
        onError: (err) => {
            console.error('Error approving comment:', err);
            Swal.fire('Error', err.response?.data?.error || 'Failed to approve comment.', 'error');
        }
    });

    const deleteCommentMutation = useMutation({
        mutationFn: async (commentId) => {
            const res = await axiosSecure.delete(`/admin/comments/${commentId}`);
            return res.data;
        },
        onSuccess: () => {
            Swal.fire('Deleted!', 'Comment has been permanently deleted.', 'success');
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
            cancelButtonText: 'No, cancel'
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
            cancelButtonText: 'No, cancel'
        });

        if (isConfirmed) {
            deleteCommentMutation.mutate(commentId);
        }
    };

    if (isLoading) {
        return <p className="text-center text-gray-500 mt-8">Loading reported comments...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500 mt-8">Error loading comments: {error.message}</p>;
    }

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">
                Reported Comments Overview
            </h2>

            {reportedComments.length === 0 ? (
                <p className="text-center text-gray-600 text-lg mt-10">No comments currently reported. All clear!</p>
            ) : (
                <div className="overflow-x-auto rounded-lg shadow-md bg-white">
                    <table className="min-w-full text-sm md:text-base table-auto">
                        <thead className="bg-purple-100 text-purple-800">
                            <tr>
                                <th className="p-3 text-left">Commenter Email</th>
                                <th className="p-3 text-left">Comment</th>
                                <th className="p-3 text-left">Report Feedback</th>
                                <th className="p-3 text-left">Original Post</th>
                                <th className="p-3 text-left">Reported At</th>
                                <th className="p-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportedComments.map((comment) => {
                                const shortText = comment.commentText.length > 50
                                    ? comment.commentText.slice(0, 50) + '...'
                                    : comment.commentText;

                                return (
                                    <tr key={comment._id} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="p-3 break-words min-w-[150px]">{comment.userEmail}</td>
                                        <td className="p-3 min-w-[250px]">
                                            {shortText}
                                            {comment.commentText.length > 50 && (
                                                <button
                                                    onClick={() => setSelectedComment(comment)}
                                                    className="ml-2 text-blue-600 hover:underline text-xs"
                                                >
                                                    Read More
                                                </button>
                                            )}
                                        </td>
                                        <td className="p-3 min-w-[120px] font-semibold text-red-600">
                                            {comment.feedback}
                                        </td>
                                        <td className="p-3 break-words min-w-[180px]">
                                            {comment.postTitle || 'Loading...'}
                                        </td>
                                        <td className="p-3 min-w-[140px]">
                                            {comment.reportedAt ? format(new Date(comment.reportedAt), 'MMM dd, yyyy HH:mm') : 'N/A'}
                                        </td>
                                        <td className="p-3 text-center min-w-[180px]">
                                            <div className="flex flex-col sm:flex-row sm:justify-center sm:items-center gap-2">
                                                <button
                                                    onClick={() => handleApprove(comment._id)}
                                                    className="btn btn-sm bg-green-500 hover:bg-green-600 text-white rounded-md shadow-sm"
                                                    disabled={approveCommentMutation.isLoading || deleteCommentMutation.isLoading}
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(comment._id)}
                                                    className="btn btn-sm bg-red-500 hover:bg-red-600 text-white rounded-md shadow-sm"
                                                    disabled={approveCommentMutation.isLoading || deleteCommentMutation.isLoading}
                                                >
                                                    Delete
                                                </button>
                                            </div>
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-4 py-6">
                    <div className="bg-white w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-lg shadow-xl p-6">
                        <h3 className="text-xl font-semibold mb-3 text-gray-800">Full Comment Text</h3>
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                            {selectedComment.commentText}
                        </p>
                        <div className="mt-6 flex justify-end">
                            <button
                                className="btn btn-outline btn-sm text-gray-700 hover:bg-gray-100 rounded-md px-4 py-2"
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
