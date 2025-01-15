import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./TripDetails.css";

const TripDetails = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const response = await fetch(`/api/trips/${id}`);
        if (!response.ok) throw new Error("Failed to fetch trip details");
        const data = await response.json();
        setTrip(data);
        setLoading(false);
      } catch (err) {
        console.error(err.message);
        setError(true);
        setLoading(false);
      }
    };

    fetchTripDetails();
  }, [id]);

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">Failed to load trip details.</div>;

  return (
    <div className="trip-details-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        Back to Trips
      </button>
      <h1>{trip.name}</h1>
      <p>
        {new Date(trip.start_date).toLocaleDateString()} -{" "}
        {new Date(trip.end_date).toLocaleDateString()}
      </p>
      <section className="trip-description-section">
  <h2>Description</h2>
  <p>{trip.description}</p>
</section>
    </div>
  );
};

export default TripDetails;