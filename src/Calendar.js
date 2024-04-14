import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from './axiosconf';
import moment from 'moment';
import Event from './Event';

function MyCalendar() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [newEventDescription, setNewEventDescription] = useState('');

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const handleAddEvent = async () => {
    try {
      if (newEventDescription.trim()) {
        const newEvent = {
          date: moment(selectedDate).format('DD-MM-YYYY'),
          description: newEventDescription,
        };
        await axios.post('/events', newEvent);
        setEvents([...events, newEvent]);
        setNewEventDescription('');
      }
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleAddEvent();
    }
  };

  const handlePDF = async () => {
    try {
      const response = await axios.get(`/pdf`, {
        params: { date: moment(selectedDate).format('DD-MM-YYYY') },
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);

      
      const link = document.createElement('a');
      link.href = url;
      link.download = `events_${moment(selectedDate).format('DD-MM-YYYY')}.pdf`;
  
      // document.body.appendChild(link);
      link.click();
  
      // document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error exporting to PDF:', error);
    }
  };

  const handleExcel = async () => {
    try {
        const response = await axios.get(`/xls`, {
          params: { date: moment(selectedDate).format('DD-MM-YYYY') },
          responseType: 'arraybuffer', 
        });
    
        
        const blob = new Blob([response.data], { type: 'application/octet-stream' });
    
        
        const url = window.URL.createObjectURL(blob);
    
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `events_${moment(selectedDate).format('DD-MM-YYYY')}.xlsx`;
    
        
        // document.body.appendChild(link);
        link.click();
    
        
        // document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error exporting to Excel:', error);
      }
  };

  return (
    <div>
      <h1 style={{ marginLeft: '10px' }}>REACT EVENT CALENDAR</h1>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1, margin: '10px' }}>
          <Calendar onChange={handleDateChange} value={selectedDate} />
        </div>
        <div style={{ flex: 3 }}>
          <Event selectedDate={selectedDate} />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: '10px',
              gap: '10px',
            }}
          >
            <input
              type="text"
              placeholder="Enter event description"
              value={newEventDescription}
              onChange={(e) => setNewEventDescription(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                flex: 1,
                maxWidth: '200px',
              }}
            />
            <button onClick={handleAddEvent}>Add Event</button>
            <button onClick={handlePDF}>Export to PDF</button>
            <button onClick={handleExcel}>Export to Excel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyCalendar;