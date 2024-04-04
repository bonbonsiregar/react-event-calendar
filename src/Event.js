import React, { useState, useEffect } from 'react';
import axios from './axiosconf';

function Event({ selectedDate }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/events', {
          params: { date: selectedDate },
        });
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    if (selectedDate) {
      fetchEvents();
    }
  }, [selectedDate]);

  return (
    <div>
      <h2>Events for {selectedDate.toDateString()}</h2>
      <ul>
        {events.map((event, index) => (
          <li key={index}>{event.description}</li>
        ))}
      </ul>
    </div>
  );
}

export default Event;
