import React, { useState, useEffect } from 'react';
import axios from './axiosconf';
import moment from 'moment';

function Event({ selectedDate }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [editEventDescription, setEditEventDescription] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      if (!selectedDate) return;
      setLoading(true);
      try {
        const response = await axios.get('/events', {
          params: { date: moment(selectedDate).format('DD-MM-YYYY') },
        });
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [selectedDate]);

  const handleEditEvent = async (eventId) => {
    try {
      await axios.put(`/events/${eventId}`, { description: editEventDescription });
      const updatedEvents = events.map((event) => {
        if (event._id === eventId) {
          return { ...event, description: editEventDescription };
        }
        return event;
      });
      setEvents(updatedEvents);
      setEditingEventId(null);
      setEditEventDescription('');
    } catch (error) {
      console.error('Error editing event:', error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await axios.delete(`/events/${eventId}`);
      const updatedEvents = events.filter((event) => event._id !== eventId);
      setEvents(updatedEvents);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleEditButtonClick = (eventId, description) => {
    if (editingEventId === eventId) {
      handleEditEvent(eventId);
    } else {
      setEditingEventId(eventId);
      setEditEventDescription(description);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleEditEvent(editingEventId);
    }
  };

  if (!selectedDate) {
    return <div>Select a date to view events.</div>;
  }

  return (
    <div>
      <h2>Events for {moment(selectedDate).format('MMMM DD, YYYY')}</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {events.length > 0 ? (
            events.map((event) => (
              <li key={event._id}>
                {editingEventId === event._id ? (
                  <input
                    type="text"
                    value={editEventDescription}
                    onChange={(e) => setEditEventDescription(e.target.value)}
                    onKeyDown={handleKeyDown}
                    style={{ marginRight: '10px' }}
                  />
                ) : (
                  event.description
                )}
                <button onClick={() => handleEditButtonClick(event._id, event.description)}>
                  {editingEventId === event._id ? 'Save' : 'Edit'}
                </button>
                <button onClick={() => handleDeleteEvent(event._id)}>Delete</button>
              </li>
            ))
          ) : (
            <div>No events for this date.</div>
          )}
        </ul>
      )}
    </div>
  );
}

export default Event;