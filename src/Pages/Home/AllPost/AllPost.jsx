import React, { useEffect, useState } from "react";
import { Link } from "react-router";
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
  }, [sort, page]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Forum Posts</h2>
        <button
          onClick={() => setSort(sort === "popular" ? "newest" : "popular")}
          className="btn btn-sm btn-outline"
        >
          Sort by {sort === "popular" ? "Newest" : "Popularity"}
        </button>
      </div>

      {posts.map((post) => (
        <Link
          key={post._id}
          to={`/post/${post._id}`}
          className="block hover:shadow-lg transition-shadow"
        >
          <div className="card bg-base-100 shadow mb-4">
            <div className="card-body">
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={post.authorImage}
                  alt={post.authorName}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="font-bold">{post.authorName}</h3>
                  <p className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(post.createdAt))} ago
                  </p>
                </div>
              </div>
              <h2 className="card-title">{post.title}</h2>
              <div className="flex flex-wrap gap-2 mt-2">
                {post.tags?.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="flex justify-between text-sm mt-4 text-gray-600">
                <p>👍 {post.upVote} | 👎 {post.downVote}</p>
                <p>💬 {post.commentCount || 0} Comments</p>
              </div>
            </div>
          </div>
        </Link>
      ))}

      {/* Pagination */}
      <div className="flex justify-center gap-3 mt-6">
        <button
          className="btn btn-sm"
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
        >
          Prev
        </button>
        <span className="btn btn-sm btn-disabled">Page {page}</span>
        <button
          className="btn btn-sm"
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllPosts;
