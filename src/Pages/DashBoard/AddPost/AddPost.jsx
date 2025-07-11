import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import { useNavigate } from "react-router";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";


const tagOptions = [
  { value: "tech", label: "Tech" },
  { value: "lifestyle", label: "Lifestyle" },
  { value: "education", label: "Education" },
  { value: "news", label: "News" },
];

const AddPost = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure(); 
  const { register, handleSubmit, reset } = useForm();
  const [tag, setTag] = useState(null);
  const [postCount, setPostCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPostCount = async () => {
      try {
        const res = await axiosSecure.get(`/posts/count?email=${user?.email}`);
        setPostCount(res.data.count);
      } catch (err) {
        console.error("Error fetching post count", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.email) {
      fetchPostCount();
    }
  }, [user, axiosSecure]);

  const onSubmit = async (data) => {
    if (!tag) return alert("Please select a tag");

    
    const post = {
      title: data.title,                 
      content: data.description,          
      authorId: user.uid,                 
      authorName: user.displayName,      
      tags: [tag.value],                 
      upVote: 0,
      downVote: 0,
      authorEmail: user.email,
      authorImage: user.photoURL,
      createdAt: new Date(),
    };

    try {
      const res = await axiosSecure.post("/posts", post);
      if (res.data.insertedId) {
        alert("Post added successfully!");
        reset();
        setTag(null);
      } else {
        alert("Failed to add post");
      }
    } catch (err) {

      console.error("Failed to add post", err.response?.data || err.message);
      alert("Something went wrong while adding the post.");
    }
  };

  if (isLoading) return <div className="text-center mt-10">Loading...</div>;

  if (postCount >= 5) {
    return (
      <div className="text-center mt-20">
        <p className="text-lg mb-4 text-red-600">
          You've reached the 5 post limit. Become a member to add more!
        </p>
        <button
          onClick={() => navigate("/membership")}
          className="btn btn-primary"
        >
          Become a Member
        </button>
      </div>
    );
  }

  return (
   <div className="w-full max-w-md sm:max-w-xl lg:max-w-5xl mx-auto p-6 mt-10 bg-white shadow rounded">

      <h2 className="text-2xl font-bold mb-6">Add New Post</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* Author Info */}
        <div>
          <label className="block mb-1 font-semibold">Author Image</label>
          <img
            src={user?.photoURL}
            alt="Author"
            className="w-16 h-16 rounded-full border"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Author Name</label>
          <input
            type="text"
            defaultValue={user?.displayName}
            readOnly
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Author Email</label>
          <input
            type="email"
            defaultValue={user?.email}
            readOnly
            className="input input-bordered w-full"
          />
        </div>

        {/* Title */}
        <div>
          <label className="block mb-1 font-semibold">Post Title</label>
          <input
            {...register("title", { required: true })}
            type="text"
            placeholder="Enter post title"
            className="input input-bordered w-full"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 font-semibold">Post Description</label>
          <textarea
            {...register("description", { required: true })}
            placeholder="Write your post..."
            className="textarea textarea-bordered w-full"
            rows={5}
          ></textarea>
        </div>

        {/* Tag Select */}
        <div>
          <label className="block mb-1 font-semibold">Tag</label>
          <Select
            options={tagOptions}
            value={tag}
            onChange={setTag}
            placeholder="Select a tag"
          />
        </div>

        {/* Submit */}
        <button type="submit" className="btn btn-primary w-full">
          Submit Post
        </button>
      </form>
    </div>
  );
};

export default AddPost;
