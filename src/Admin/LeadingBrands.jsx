import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import "./OurBlogs.css";

const LeadingBrands = () => {
  const { register, handleSubmit, reset, setValue } = useForm();
  const [blogs, setBlogs] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null); // To handle edit state
  const [imagePreview, setImagePreview] = useState("");
  const [showForm, setShowForm] = useState(false); // Toggle form visibility

  // Fetch blogs on component load
  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/leadingBrands`
      );
      setBlogs(response.data);
      setShowForm(false);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  const deleteBlog = async (id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/leadingBrands/${id}`
      );
      fetchBlogs(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  const handleEdit = (blog) => {
    setSelectedBlog(blog);
    setImagePreview(blog.imageUrl);
    setShowForm(true); // Show form when editing
  };

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
      if (data.image.length > 0) {
        formData.append("image", data.image[0]);
      }

      const url = selectedBlog
        ? `${process.env.REACT_APP_API_URL}/api/leadingBrands/${selectedBlog._id}`
        : `${process.env.REACT_APP_API_URL}/api/leadingBrands/upload`;

      const response = await axios({
        method: selectedBlog ? "put" : "post",
        url,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Operation successful!");
      reset();
      setSelectedBlog(null);
      setImagePreview("");
      fetchBlogs();
      setShowForm(false); // Hide form after submission
    } catch (error) {
      console.error("Error during operation:", error);
      alert("Operation failed.");
    } finally {
      setUploading(false);
    }
  };

  // State to track which blog is expanded for "Read More"
  const [expandedBlogId, setExpandedBlogId] = useState(null);

  // Function to toggle the "Read More" state
  const toggleReadMore = (id) => {
    setExpandedBlogId(expandedBlogId === id ? null : id);
  };

  return (
    <div className="our-blogs-container">
      <h1>Our Leading Brands</h1>

      <button
        onClick={() => setShowForm(!showForm)}
        className="toggle-form-btn"
      >
        {showForm ? "Close leading brand Form" : "Add New leading brand"}
      </button>

      {/* Form to upload or edit blogs */}
      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="form-container">
          <div className="form-group">
            <label>Image Upload:</label>
            <input
              type="file"
              {...register("image")}
              accept="image/*"
              onChange={onImageChange}
            />
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="preview" />
              </div>
            )}
          </div>

          <button type="submit" disabled={uploading} className="submit-btn">
            {uploading
              ? "Uploading..."
              : selectedBlog
              ? "Update leading brand"
              : "Submit"}
          </button>
        </form>
      )}

      {/* leading brand List */}
      <div className="blog-grid">
        {blogs.map((blog) => (
          <div key={blog._id} className="blog-card">
            <img src={blog.imageUrl} alt={blog.title} className="blog-image" />

            <div className="action-buttons">
              <button onClick={() => handleEdit(blog)} className="edit-btn">
                Edit
              </button>
              <button
                onClick={() => deleteBlog(blog._id)}
                className="delete-btn"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeadingBrands;
