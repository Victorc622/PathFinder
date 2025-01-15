import React, { useState } from 'react';
import "./TripForm.css"

const CreateTrip = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [destinations, setDestinations] = useState([
    {
      name: '',
      location: '',
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

  const addDestination = () => {
    setDestinations((prev) => [
      ...prev,
      {
        name: '',
        location: '',
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

  const addActivity = (destIndex) => {
    const updatedDestinations = [...destinations];
    updatedDestinations[destIndex].activities.push({
      name: '',
      description: '',
      time: '',
    });
    setDestinations(updatedDestinations);
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
            <div className="form-group">
              <label>Notes:</label>
              <textarea
                name="notes"
                value={destination.notes}
                onChange={(e) => handleDestinationChange(destIndex, e)}
                placeholder="Add any notes about this destination"
              />
            </div>
            <div className="form-group">
              <label>Start Date:</label>
              <input
                type="date"
                name="start_date"
                value={destination.start_date}
                onChange={(e) => handleDestinationChange(destIndex, e)}
              />
            </div>
            <div className="form-group">
              <label>End Date:</label>
              <input
                type="date"
                name="end_date"
                value={destination.end_date}
                onChange={(e) => handleDestinationChange(destIndex, e)}
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
            <button type="button" onClick={() => addActivity(destIndex)}>
              + Add Activity
            </button>
          </div>
        ))}
        <button type="button" onClick={addDestination}>
          + Add Destination
        </button>
        <button type="submit" className="submit-button">Create Trip</button>
      </form>
    </div>
  );
};

export default CreateTrip;