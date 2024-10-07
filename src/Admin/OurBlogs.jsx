import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import "./OurBlogs.css"; // Importing the CSS

const OurBlogs = () => {
  const { register, handleSubmit, reset } = useForm();
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);

  const onImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("image", data.image[0]);
      formData.append("title", data.title); // Adding title to the payload
      formData.append("description", data.description);
      formData.append("blogUrl", data.link);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/blog/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert("Upload successful!");
      reset();
      setImagePreview("");
    } catch (error) {
      console.error("@@Error uploading:", error);
      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="our-blogs-container">
      <h2 className="form-title">
        Upload Blog Image, Title, Description, and Link
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="form-container">
        <div className="form-group">
          <label>Image Upload:</label>
          <input
            type="file"
            {...register("image", { required: true })}
            accept="image/*"
            onChange={onImageChange}
          />
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="preview" />
            </div>
          )}
        </div>
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            {...register("title", { required: true })}
            placeholder="Enter blog title"
            className="title-input"
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            {...register("description", { required: true })}
            placeholder="Enter blog description"
            className="description-input"
          ></textarea>
        </div>
        <div className="form-group">
          <label>Blog Link:</label>
          <input
            type="text"
            {...register("link", { required: false })}
            placeholder="Enter blog link"
            className="link-input"
          />
        </div>
        <button type="submit" disabled={uploading} className="submit-btn">
          {uploading ? "Uploading..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default OurBlogs;
