import { useParams } from 'react-router';
import { useQuery, useMutation } from '@tanstack/react-query';
import { FacebookShareButton, FacebookIcon } from 'react-share';
import { useState } from 'react';

import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';

const PostDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [commentText, setCommentText] = useState('');

   const { data: post, refetch } = useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/posts/${id}`);
      return res.data;
    },
  });

   const { data: comments, refetch: refetchComments } = useQuery({
    queryKey: ['comments', id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/comments/${id}`);
      return res.data;
    },
  });

  const voteMutation = useMutation({
    mutationFn: async (type) => axiosSecure.patch(`/posts/vote/${id}`, { type }),
    onSuccess: refetch
  });

  const commentMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        postId: id,
        userId: user.uid,
        userName: user.displayName,
        userImage: user.photoURL,
        commentText
      };
      await axiosSecure.post('/comments', payload);
    },
    onSuccess: () => {
      setCommentText('');
      refetchComments();
    }
  });

  if (!post) return <div>Loading...</div>;

  const shareUrl = `${window.location.origin}/post/${id}`;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="bg-white p-4 shadow-md rounded-md">
        <div className="flex items-center gap-4 mb-4">
          <img src={post.authorImage} alt="" className="w-10 h-10 rounded-full" />
          <div>
            <h3 className="font-semibold">{post.authorName}</h3>
            <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold">{post.title}</h2>
        <p className="text-gray-800 mt-2">{post.content}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {post.tags?.map(tag => (
            <span key={tag} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{tag}</span>
          ))}
        </div>

        <div className="flex items-center gap-4 mt-4">
          <button onClick={() => voteMutation.mutate('up')} className="text-green-600 hover:underline">👍 {post.upVote}</button>
          <button onClick={() => voteMutation.mutate('down')} className="text-red-600 hover:underline">👎 {post.downVote}</button>

          <FacebookShareButton url={shareUrl}>
            <FacebookIcon size={32} round />
          </FacebookShareButton>
        </div>
      </div>

      <div className="bg-white p-4 shadow rounded-md">
        <h3 className="text-xl font-semibold mb-2">Comments</h3>

        {user ? (
          <div className="mb-4">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full border rounded-md p-2"
              placeholder="Write your comment..."
            />
            <button
              onClick={() => commentMutation.mutate()}
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Comment
            </button>
          </div>
        ) : (
          <p className="text-gray-500">Please log in to comment.</p>
        )}

        <div className="space-y-4">
          {comments?.map(c => (
            <div key={c._id} className="border-b pb-2">
              <div className="flex gap-2 items-center mb-1">
                <img src={c.userImage} className="w-6 h-6 rounded-full" />
                <p className="text-sm font-medium">{c.userName}</p>
              </div>
              <p>{c.commentText}</p>
              <p className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
