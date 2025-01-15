import React, { useState, useRef } from "react";
import { LoadScript, Autocomplete, GoogleMap, Marker } from "@react-google-maps/api";
import "./TripForm.css";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const CreateTrip = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [destinations, setDestinations] = useState([
    {
      name: '',
      location: '',
      lat: null,
      lng: null,
      start_date: '',
      end_date: '',
      notes: '',
      activities: [
        {
          name: '',
          description: '',
          time: '',
        },
      ],
    },
  ]);

  const [center, setCenter] = useState({ lat: 37.7749, lng: -122.4194 });
  const [zoom, setZoom] = useState(10);
  const [searchMarker, setSearchMarker] = useState(null);
  const autocompleteRef = useRef(null);

  const handleDestinationChange = (index, e) => {
    const { name, value } = e.target;
    const updatedDestinations = [...destinations];
    updatedDestinations[index][name] = value;
    setDestinations(updatedDestinations);
  };

  const handleActivityChange = (destIndex, actIndex, e) => {
    const { name, value } = e.target;
    const updatedDestinations = [...destinations];
    updatedDestinations[destIndex].activities[actIndex][name] = value;
    setDestinations(updatedDestinations);
  };

  const addActivity = (destIndex) => {
    const updatedDestinations = [...destinations];
    updatedDestinations[destIndex].activities.push({
      name: '',
      description: '',
      time: '',
    });
    setDestinations(updatedDestinations);
  };

  const addDestination = () => {
    setDestinations((prev) => [
      ...prev,
      {
        name: '',
        location: '',
        lat: null,
        lng: null,
        start_date: '',
        end_date: '',
        notes: '',
        activities: [
          {
            name: '',
            description: '',
            time: '',
          },
        ],
      },
    ]);
  };

  const handleSearchPlaceSelect = () => {
    const place = autocompleteRef.current.getPlace();
    if (place && place.geometry) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      setCenter({ lat, lng });
      setZoom(14);
      setSearchMarker({ lat, lng });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/trips/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          start_date: startDate,
          end_date: endDate,
          destinations,
        }),
      });

      if (response.ok) {
        window.location.href = '/trips';
      } else {
        console.error('Error creating trip:', await response.json());
      }
    } catch (error) {
      console.error('Error creating trip:', error);
    }
  };

  return (
    <div className="trip-form-page">
      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={['places']}>
        <div className="trip-form-container">
          <form onSubmit={handleSubmit} className="trip-form">
            <h1>Create a New Trip</h1>
            <div className="form-group">
              <label>Trip Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter the trip name"
              />
            </div>
            <div className="form-group">
              <label>Description:</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter a brief description of your trip"
              />
            </div>
            <div className="form-group">
              <label>Start Date:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>End Date:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
            <h2>Destinations</h2>
            {destinations.map((destination, destIndex) => (
              <div key={destIndex} className="destination-group">
                <h3>Destination {destIndex + 1}</h3>
                <div className="form-group">
                  <label>Destination Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={destination.name}
                    onChange={(e) => handleDestinationChange(destIndex, e)}
                    placeholder="Enter the destination name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Location:</label>
                  <input
                    type="text"
                    name="location"
                    value={destination.location}
                    onChange={(e) => handleDestinationChange(destIndex, e)}
                    placeholder="Enter the location"
                  />
                </div>
                <h4>Activities</h4>
                {destination.activities.map((activity, actIndex) => (
                  <div key={actIndex} className="activity-group">
                    <div className="form-group">
                      <label>Activity Name:</label>
                      <input
                        type="text"
                        name="name"
                        value={activity.name}
                        onChange={(e) => handleActivityChange(destIndex, actIndex, e)}
                        placeholder="Enter the activity name"
                      />
                    </div>
                    <div className="form-group">
                      <label>Description:</label>
                      <textarea
                        name="description"
                        value={activity.description}
                        onChange={(e) => handleActivityChange(destIndex, actIndex, e)}
                        placeholder="Add a description for the activity"
                      />
                    </div>
                    <div className="form-group">
                      <label>Time:</label>
                      <input
                        type="time"
                        name="time"
                        value={activity.time}
                        onChange={(e) => handleActivityChange(destIndex, actIndex, e)}
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addActivity(destIndex)}
                  className="add-activity-button"
                >
                  + Add Activity
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addDestination}
              className="add-destination-button"
            >
              + Add Destination
            </button>
            <button type="submit" className="submit-button">
              Create Trip
            </button>
          </form>
        </div>
        <div className="map-container">
          <div className="map-search-bar">
            <Autocomplete
              onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
              onPlaceChanged={handleSearchPlaceSelect}
            >
              <input
                type="text"
                placeholder="Search for a location..."
                className="map-search-input"
              />
            </Autocomplete>
          </div>
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={center}
            zoom={zoom}
          >
            {destinations.map((destination, index) => (
              destination.lat &&
              destination.lng && (
                <Marker
                  key={index}
                  position={{ lat: destination.lat, lng: destination.lng }}
                  title={destination.name}
                />
              )
            ))}
            {searchMarker && (
              <Marker position={searchMarker} title="Searched Location" />
            )}
          </GoogleMap>
        </div>
      </LoadScript>
    </div>
  );
};

export default CreateTrip;