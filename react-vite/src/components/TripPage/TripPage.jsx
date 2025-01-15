import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./TripPage.css";

const TripPage = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch("/api/trips/");
        if (!response.ok) throw new Error("Failed to fetch trips");
        const data = await response.json();
        setTrips(data.trips || []);
        setLoading(false);
      } catch (err) {
        console.error(err.message);
        setError(true);
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const handleDeleteTrip = async (tripId) => {
    if (!window.confirm("Are you sure you want to delete this trip?")) return;

    try {
      const response = await fetch(`/api/trips/${tripId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete trip");

      setTrips((prevTrips) => prevTrips.filter((trip) => trip.id !== tripId));
    } catch (err) {
      console.error(err.message);
      alert("Failed to delete trip. Please try again.");
    }
  };

  const handleEditTrip = (tripId) => {
    navigate(`/trips/edit/${tripId}`);
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;

  return (
    <div className="trip-page-container">
      <header className="trip-page-header">
        <h1>My Trips</h1>
        {error || trips.length === 0 ? (
          <div className="no-trips-message">
            <p>You currently have no trips planned</p>
          </div>
        ) : null}

        <Link to="/create-trip">
          <button className="create-trip-button">+ Create New Trip</button>
        </Link>
      </header>
      <div className="trip-list">
        {trips.map((trip) => (
          <div key={trip.id} className="trip-card">
            <div
              className="trip-info"
              onClick={() => navigate(`/trips/${trip.id}`)}
            >
              <h3>{trip.name}</h3>
              <p>{trip.description}</p>
              <p className="trip-dates">
                {new Date(trip.start_date).toLocaleDateString()} -{" "}
                {new Date(trip.end_date).toLocaleDateString()}
              </p>
            </div>
            <div className="trip-actions">
              <button
                className="edit-trip-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditTrip(trip.id);
                }}
              >
                Edit
              </button>
              <button
                className="delete-trip-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteTrip(trip.id);
                }}
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

export default TripPage;