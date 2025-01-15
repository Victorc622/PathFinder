import React, { useState, useEffect } from "react";

const Destinations = ({ tripId }) => {
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    const fetchDestinations = async () => {
      const response = await fetch(`/api/destinations/${tripId}`);
      const data = await response.json();
      setDestinations(data.destinations);
    };

    fetchDestinations();
  }, [tripId]);

  return (
    <div>
      <h2>Destinations</h2>
      <ul>
        {destinations.map((destination) => (
          <li key={destination.id}>
            <h3>{destination.name}</h3>
            <p>{destination.location}</p>
            <p>{destination.notes}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Destinations;