import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";

const AddPost = () => {
  const { register, handleSubmit, reset } = useForm();
  const [selectedTag, setSelectedTag] = useState(null);

  const tags = [
    { value: "technology", label: "Technology" },
    { value: "science", label: "Science" },
    { value: "career", label: "Career" },
    { value: "fun", label: "Fun" },
  ];

  const onSubmit = (data) => {
    const postData = {
      authorImage: data.authorImage,
      authorName: data.authorName,
      authorEmail: data.authorEmail,
      title: data.title,
      description: data.description,
      tag: selectedTag?.value || "",
      upVote: 0,
      downVote: 0,
    };

    console.log("New Post Data:", postData);
    reset();
    setSelectedTag(null);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded shadow bg-white">
      <h2 className="text-2xl font-semibold mb-4">Add New Post</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Author Image */}
        <div>
          <label className="block font-medium mb-1">Author Image URL</label>
          <input
            type="text"
            {...register("authorImage")}
            className="input input-bordered w-full"
          />
        </div>

        {/* Author Name */}
        <div>
          <label className="block font-medium mb-1">Author Name</label>
          <input
            type="text"
            {...register("authorName")}
            className="input input-bordered w-full"
          />
        </div>

        {/* Author Email */}
        <div>
          <label className="block font-medium mb-1">Author Email</label>
          <input
            type="email"
            {...register("authorEmail")}
            className="input input-bordered w-full"
          />
        </div>

        {/* Post Title */}
        <div>
          <label className="block font-medium mb-1">Post Title</label>
          <input
            type="text"
            {...register("title")}
            className="input input-bordered w-full"
          />
        </div>

        {/* Post Description */}
        <div>
          <label className="block font-medium mb-1">Post Description</label>
          <textarea
            {...register("description")}
            rows="5"
            className="textarea textarea-bordered w-full"
          />
        </div>

        {/* Tag Dropdown */}
        <div>
          <label className="block font-medium mb-1">Tag</label>
          <Select
            options={tags}
            value={selectedTag}
            onChange={setSelectedTag}
            placeholder="Select a tag"
          />
        </div>

        {/* Hidden UpVote and DownVote */}
        <input type="hidden" value={0} {...register("upVote")} />
        <input type="hidden" value={0} {...register("downVote")} />

        {/* Submit */}
        <button type="submit" className="btn btn-primary w-full">
          Submit Post
        </button>
      </form>
    </div>
  );
};

export default AddPost;
