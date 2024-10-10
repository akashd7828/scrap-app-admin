import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import "./ScrapType.css";

const CreateScrapType = () => {
  const { register, handleSubmit, reset, setValue } = useForm();
  const [scraps, setScraps] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedScrap, setSelectedScrap] = useState(null); // To handle edit state
  const [showForm, setShowForm] = useState(false); // Toggle form visibility

  // Fetch scrap types on component load
  useEffect(() => {
    fetchScrapTypes();
  }, []);

  const fetchScrapTypes = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/scrap-types`
      );
      setScraps(response.data); // Assuming response.data is an array of scrap types
    } catch (error) {
      console.error("Error fetching scrap types:", error);
    }
  };

  const deleteScrap = async (id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/scrap-types/${id}`
      );
      fetchScrapTypes(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting scrap type:", error);
    }
  };

  const handleEdit = (scrap) => {
    setSelectedScrap(scrap);
    setValue("scrapType", scrap.scrapType);
    setValue("amount", scrap.amount);
    setValue("unit", scrap.unit);
    setValue("minWeight", scrap.minWeight);
    setValue("note", scrap.note);
    setShowForm(true); // Show form when editing
  };

  const onSubmit = async (data) => {
    try {
      setUploading(true);

      const url = selectedScrap
        ? `${process.env.REACT_APP_API_URL}/api/scrap-types/${selectedScrap._id}`
        : `${process.env.REACT_APP_API_URL}/api/scrap-types`;

      const response = await axios({
        method: selectedScrap ? "put" : "post",
        url,
        data,
      });

      alert("Operation successful!");
      reset();
      setSelectedScrap(null);
      fetchScrapTypes();
      setShowForm(false); // Hide form after submission
    } catch (error) {
      console.error("Error during operation:", error);
      alert("Operation failed.");
    } finally {
      setUploading(false);
    }
  };

  // State to track which scrap type is expanded for "Read More"
  const [expandedScrapId, setExpandedScrapId] = useState(null);

  // Function to toggle the "Read More" state
  const toggleReadMore = (id) => {
    setExpandedScrapId(expandedScrapId === id ? null : id);
  };

  return (
    <div className="our-blogs-container">
      <h1>Scrap Types</h1>

      <button
        onClick={() => setShowForm(!showForm)}
        className="toggle-form-btn"
      >
        {showForm ? "Close Form" : "Add New Scrap Type"}
      </button>

      {/* Form to upload or edit scrap types */}
      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="form-container">
          <div className="form-group">
            <label>Scrap Type:</label>
            <input
              type="text"
              {...register("scrapType", { required: true })}
              placeholder="Enter scrap type"
              className="scrapType-input"
            />
          </div>
          <div className="form-group">
            <label>Amount:</label>
            <input
              type="number"
              {...register("amount", { required: true })}
              placeholder="Enter amount"
              className="amount-input"
            />
          </div>
          <div className="form-group">
            <label>Unit:</label>
            <select
              {...register("unit", { required: true })}
              className="unit-select"
            >
              <option value="kg">per kg</option>
              <option value="unit">per unit</option>
            </select>
          </div>
          <div className="form-group">
            <label>Min Weight:</label>
            <input
              type="number"
              {...register("minWeight", { required: true })}
              placeholder="Enter minimum weight"
              className="minWeight-input"
            />
          </div>
          <div className="form-group">
            <label>Note:</label>
            <textarea
              {...register("note")}
              placeholder="Enter note (optional)"
              className="note-input"
            ></textarea>
          </div>
          <button type="submit" disabled={uploading} className="submit-btn">
            {uploading
              ? "Uploading..."
              : selectedScrap
              ? "Update Scrap Type"
              : "Submit"}
          </button>
        </form>
      )}

      {/* Scrap Types List */}
      <div className="blog-grid">
        {scraps.map((scrap) => (
          <div key={scrap._id} className="blog-card">
            <h3 className="blog-title">{scrap.scrapType}</h3>
            <p className="blog-description">
              <strong>Amount:</strong> {scrap.amount} {scrap.unit}
            </p>
            <p className="blog-description">
              <strong>Min Weight:</strong> {scrap.minWeight}
            </p>
            <p className="blog-description">
              <strong>Note:</strong> {scrap.note || "No notes"}
            </p>
            <div className="action-buttons">
              <button onClick={() => handleEdit(scrap)} className="edit-btn">
                Edit
              </button>
              <button
                onClick={() => deleteScrap(scrap._id)}
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

export default CreateScrapType;
