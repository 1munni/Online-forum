import React from "react";
import { useNavigate } from "react-router";
import { FaTag } from "react-icons/fa";

const tagOptions = [
  { value: "tech", label: "Tech" },
  { value: "lifestyle", label: "Lifestyle" },
  { value: "education", label: "Education" },
  { value: "news", label: "News" },
];

const BrowseTags = () => {
  const navigate = useNavigate();

  const handleTagClick = (tag) => {
    // Navigate to a tag-based search page or trigger filter logic
    navigate(`/tags/${tag}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center flex items-center justify-center gap-2">
        <FaTag className="text-primary" /> Browse by Tags
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {tagOptions.map((tag) => (
          <button
            key={tag.value}
            onClick={() => handleTagClick(tag.value)}
            className="bg-primary/10 hover:bg-primary/20 text-primary font-semibold py-3 px-4 rounded-xl shadow-sm transition-all duration-200 w-full text-center"
          >
            {tag.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BrowseTags;
