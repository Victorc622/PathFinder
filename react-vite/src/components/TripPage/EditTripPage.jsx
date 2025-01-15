import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditTripPage.css";

const EditTripPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const response = await fetch(`/api/trips/${id}`);
        if (!response.ok) throw new Error("Failed to fetch trip details");
        const data = await response.json();

        setTrip(data);
        setFormData({
          name: data.name,
          description: data.description,
          start_date: new Date(data.start_date).toISOString().split("T")[0],
          end_date: new Date(data.end_date).toISOString().split("T")[0],
        });
        setLoading(false);
      } catch (err) {
        console.error(err.message);
        setError(true);
        setLoading(false);
      }
    };

    fetchTripDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/trips/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update trip");

      navigate(`/trips/${id}`, { replace: true });
    } catch (err) {
      console.error(err.message);
      alert("Failed to update the trip. Please try again.");
    }
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">Failed to load trip details.</div>;

  return (
    <div className="edit-trip-container">
      <h1>Edit Trip</h1>
      <form className="edit-trip-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Trip Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="start_date">Start Date</label>
          <input
            type="date"
            id="start_date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="end_date">End Date</label>
          <input
            type="date"
            id="end_date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="save-button">Save Changes</button>
        <button
          type="button"
          className="cancel-button"
          onClick={() => navigate(`/trips/${id}`, { replace: true })}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditTripPage;