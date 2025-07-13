import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
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
  const [isMember, setIsMember] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPostCount = async () => {
      try {
        const res = await axiosSecure.get(`/posts-count/count?email=${user?.email}`);
        setPostCount(res.data.count);
      } catch (err) {
        console.error("Error fetching post count", err);
        Swal.fire("Error", "Failed to fetch post count.", "error");
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.email) {
      fetchPostCount();
    }
  }, [user, axiosSecure]);

  const onSubmit = async (data) => {
    if (!tag) {
      return Swal.fire("Missing Tag", "Please select a tag for the post.", "warning");
    }

    if (!user?.uid || !user?.displayName || !user?.email || !user?.photoURL) {
      return Swal.fire("User Info Incomplete", "Some required user info is missing.", "error");
    }

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
        await Swal.fire("Success", "Post added successfully!", "success");
        reset();
        setTag(null);
        navigate("/");
      } else {
        Swal.fire("Failed", "Failed to add post. Try again.", "error");
      }
    } catch (err) {
      console.error("Post add error:", err);
      Swal.fire("Error", err.response?.data?.message || "Something went wrong.", "error");
    }
  };

  if (isLoading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (postCount >= 5) {
    return (
      <div className="text-center mt-20 px-4">
        <p className="text-xl font-semibold mb-4 text-red-600">
          🚫 You've reached your 5 post limit as a free user.
        </p>
        <p className="text-lg mb-6">
          Become a member to unlock unlimited posting access.
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
            className="input input-bordered w-full"
            disabled
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
