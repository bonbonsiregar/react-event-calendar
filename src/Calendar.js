import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from './axiosconf';
import moment from 'moment';

function MyCalendar() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const handleAddEvent = async () => {
    try {
      const description = prompt('Enter event description:');
      if (description) {
        const newEvent = {
          date: moment(selectedDate).format('DD/MM/YYYY'),
          description,
        };
        await axios.post('/events', newEvent);
        setEvents([...events, newEvent]);
      }
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1 }}>
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
          />
        </div>
        <div style={{ flex: 1 }}>
          <h2>Events</h2>
          <ul>
            {events.map((event, index) => (
              <li key={index}>{event.description}</li>
            ))}
          </ul>
          <button onClick={handleAddEvent}>Add Event</button>
        </div>
      </div>
    </div>
  );
}

export default MyCalendar;
