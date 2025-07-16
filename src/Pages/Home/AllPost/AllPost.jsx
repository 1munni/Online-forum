import React, { useEffect, useState } from "react";
import { Link } from "react-router"; // Ensure you're using react-router-dom for Link
import { formatDistanceToNow } from "date-fns";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const AllPosts = () => {
  const axiosSecure = useAxiosSecure();
  const [posts, setPosts] = useState([]);
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const limit = 5;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axiosSecure.get(
          `/posts?sort=${sort}&page=${page}&limit=${limit}`
        );
        setPosts(res.data);
      } catch (err) {
        console.error("Error loading posts:", err);
      }
    };
    fetchPosts();
  }, [sort, page, axiosSecure]);

  return (
    <div className="mx-auto px-4 py-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl my-20 max-w-6xl">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3 max-w-5xl">
          <h2 className="text-3xl font-bold text-white text-center sm:text-left">
            Forum Posts
          </h2>
          <button
            onClick={() => setSort(sort === "popular" ? "newest" : "popular")}
            className="px-5 py-2 rounded-lg bg-white text-gray-800 font-semibold shadow-md hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
          >
            Sort by {sort === "popular" ? "Newest" : "Popularity"}
          </button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post._id}
              to={`/post/${post._id}`}
              className="block"
            >
              <div className="bg-white shadow-xl rounded-2xl p-6 h-full flex flex-col justify-between
                          hover:shadow-2xl hover:translate-y-[-4px] transition-all duration-300 ease-in-out
                          border border-gray-100">
                <div>
                  {/* Author Info */}
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={post.authorImage || "https://i.ibb.co/84SvHS1B/portrait-modern-woman.jpg"}
                      alt={post.authorName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-indigo-300 shadow-sm"
                    />
                    <div>
                      {/* Slightly larger author name for more prominence */}
                      <h3 className="font-bold text-gray-900 text-lg">
                        {post.authorName}
                      </h3>
                      {/* Smaller timestamp to de-emphasize */}
                      <p className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>

                  {/* Post Title - More emphasis with larger font */}
                  <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 leading-tight">
                    {post.title}
                  </h2>

                  {/* Tags Section - Consistent small size */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium uppercase tracking-wider"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Statistics (Votes & Comments) - Slightly larger for readability */}
                <div className="flex justify-between items-center text-base text-gray-600 mt-auto pt-4 border-t border-gray-200">
                  <p className="flex items-center gap-1">
                    <span role="img" aria-label="upvote">👍</span> {post.upVote}
                    <span className="ml-3 mr-1" role="img" aria-label="downvote">👎</span> {post.downVote}
                  </p>
                  <p className="flex items-center gap-1">
                    <span role="img" aria-label="comments">💬</span> {post.commentCount || 0} Comments
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 mt-10">
          <button
            className="px-6 py-2 rounded-lg bg-white text-gray-800 font-semibold shadow-md hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
          >
            Previous
          </button>
          <span className="text-white text-lg font-medium select-none">Page {page}</span>
          <button
            className="px-6 py-2 rounded-lg bg-white text-gray-800 font-semibold shadow-md hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllPosts;