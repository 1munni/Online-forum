import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router"; // Corrected import for react-router-dom
import useAxiosSecure from "../../../Hooks/useAxiosSecure";



const BannerWithSearch = () => {
    const axiosSecure = useAxiosSecure();
    const [searchTag, setSearchTag] = useState("");
    const [query, setQuery] = useState("");

    const {
        data: posts = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["searchPosts", query],
        queryFn: async () => {
            const res = await axiosSecure.get(`/posts-search/search?tag=${query}`);
            return res.data;
        },
        enabled: !!query, // Only run the query if 'query' is not empty
    });

    const handleSearch = (e) => {
        e.preventDefault();
        setQuery(searchTag.toLowerCase());
    };

    return (
        <> {/* React Fragment to return multiple top-level elements */}
            {/* Banner Section */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 py-20 px-4 text-white text-center my-10 rounded-2xl shadow">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Conversations</h1>
                <p className="text-lg md:text-xl max-w-xl mx-auto mb-8">
                    Search posts by topics like Tech, Education, News & Lifestyle
                </p>

                <form onSubmit={handleSearch} className="flex flex-col md:flex-row justify-center items-center gap-3">
                    <input
                        type="text"
                        value={searchTag}
                        onChange={(e) => setSearchTag(e.target.value)}
                        placeholder="Search by tag (e.g. tech, news)"
                        className="input input-bordered w-full md:w-96 text-black"
                    />
                    <button type="submit" className="bg-white text-indigo-600 font-medium px-4 py-2 rounded shadow hover:bg-gray-100 transition">Search</button>
                </form>

                {/* Loading/Error messages for the search *within* the banner context */}
                {isLoading && query && <p className="text-sm mt-4">Searching posts...</p>}
                {isError && query && <p className="text-sm text-red-300 mt-4">Something went wrong while searching.</p>}
            </div>

            {/* Search Results Section - Now outside the banner div */}
            {query && ( // Only show this section if a query has been made
                <div className="mt-8 max-w-4xl mx-auto text-left bg-white text-gray-900 p-6 rounded-lg shadow-lg">
                    {posts.length > 0 ? (
                        <>
                            <h2 className="text-xl font-semibold mb-4">Search Results for: <span className="text-indigo-500">{query}</span></h2>
                            <div className="space-y-4">
                                {posts.map((post) => (
                                    <Link
                                        key={post._id}
                                        to={`/posts/${post._id}`}
                                        className="block p-4 border border-gray-200 rounded hover:bg-gray-100 transition"
                                    >
                                        <h3 className="text-lg font-semibold">{post.title}</h3>
                                        <p className="text-sm text-gray-600">By {post.authorName}</p>
                                        <div className="mt-1 text-xs text-white bg-indigo-500 inline-block px-2 py-0.5 rounded">
                                            {post.tags[0]}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </>
                    ) : (
                        // No posts found message, also outside the banner div
                        !isLoading && <p className="text-gray-700 font-medium">No posts found for "<strong>{query}</strong>"</p>
                    )}
                </div>
            )}
        </>
    );
};

export default BannerWithSearch;
