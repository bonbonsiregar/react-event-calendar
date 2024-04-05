import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from './axiosconf';
import moment from 'moment';
import Event from './Event';
//import jsPDF from 'jspdf';
import * as XLSX from 'xlsx'

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
          date: moment(selectedDate).format('DD-MM-YYYY'),
          description,
        };
        await axios.post('/events', newEvent);
        setEvents([...events, newEvent]);
      }
    } catch (error) {
      console.error('Error adding event:', error);
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
  
      document.body.appendChild(link);
      link.click();
  
      document.body.removeChild(link);
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
    
        
        document.body.appendChild(link);
        link.click();
    
        
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error exporting to Excel:', error);
      }
  };

  

  return (
    <div>
    <h1 style={{ marginLeft: '10px' }}>REACT EVENT CALENDAR</h1>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1, margin: '10px'}}>
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            // defaultActiveStartDate={new Date()}
          />
        </div>
        <div style={{ flex: 3 }}>
          <Event selectedDate={selectedDate}/>
          <button onClick={handleAddEvent}>Add Event</button>
          <button onClick={handlePDF}>Export to PDF</button>
          <button onClick={handleExcel}>Export to Excel</button>
        </div>
      </div>
    </div>
  );
}

export default MyCalendar;
