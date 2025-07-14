import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { useState } from 'react';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';

const CommentsPage = () => {
  const { postId } = useParams();
  const axiosSecure = useAxiosSecure();
  const [selectedComment, setSelectedComment] = useState(null);
  const [reportedComments, setReportedComments] = useState({});

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/comments/${postId}`);
      return res.data;
    }
  });

  const handleReport = async (commentId, feedback) => {
    if (!feedback) {
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
      try {
        await axiosSecure.post(`/report-comment`, { commentId, feedback });
        setReportedComments(prev => ({ ...prev, [commentId]: true }));
        Swal.fire('Reported!', 'Comment has been reported.', 'success');
      } catch (error) {
        Swal.fire('Error reporting comment', '', 'error');
      }
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
                <th>Email</th>
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

                return (
                  <tr key={comment._id} className="align-top">
                    <td className="min-w-[120px]">{comment.userName}</td>
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
                          setReportedComments(prev => ({
                            ...prev,
                            [comment._id]: e.target.value,
                          }))
                        }
                        defaultValue=""
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
                          handleReport(comment._id, reportedComments[comment._id])
                        }
                        disabled={reportedComments[comment._id] === true}
                      >
                        {reportedComments[comment._id] === true
                          ? 'Reported'
                          : 'Report'}
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
