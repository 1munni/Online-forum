import React from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";

import { FaTags } from "react-icons/fa";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const TagPosts = () => {
  const { tag } = useParams();
  const axiosSecure = useAxiosSecure();

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["postsByTag", tag],
    queryFn: async () => {
      const res = await axiosSecure.get(`/posts-tag/tag/${tag}`);
      return res.data;
    },
  });

  if (isLoading) {
    return <div className="text-center py-10 text-lg">Loading posts...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-6">
        <FaTags className="text-2xl text-primary" />
        <h2 className="text-2xl font-semibold capitalize">
          Posts Tagged: <span className="text-primary">#{tag}</span>
        </h2>
      </div>

      {posts.length === 0 ? (
        <div className="text-center text-gray-500 mt-10 text-lg">
          No posts found under this tag.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post._id}
              className="border rounded-2xl p-5 shadow-md hover:shadow-lg transition bg-white"
            >
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={post.authorImage}
                  alt={post.authorName}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="text-sm font-semibold">{post.authorName}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                {post.title}
              </h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                {post.content}
              </p>

              <div className="flex flex-wrap gap-2 mt-3">
                {post.tags?.map((t) => (
                  <span
                    key={t}
                    className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagPosts;
