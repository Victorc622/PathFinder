import React, { useState, useEffect } from "react";

const Activities = ({ destinationId }) => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      const response = await fetch(`/api/activities/${destinationId}`);
      const data = await response.json();
      setActivities(data.activities);
    };

    fetchActivities();
  }, [destinationId]);

  return (
    <div>
      <h3>Activities</h3>
      <ul>
        {activities.map((activity) => (
          <li key={activity.id}>
            <h4>{activity.name}</h4>
            <p>{activity.description}</p>
            <p>{activity.time}</p>
            <p>{activity.notes}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Activities;