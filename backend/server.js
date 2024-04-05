const express = require('express');
const mongoose = require('mongoose');
const mongodb = require('./model');
const cors = require('cors')
const PDFDocuments = require('pdfkit')
const fs = require('fs');
const XLSX = require('xlsx')

const app = express();
const PORT = process.env.PORT || 3001;

mongoose.connect('mongodb://127.0.0.1:27017/eventcalendar', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use(cors())

//handle get
app.get('/events', async (req, res) => {
  try {
    const { date } = req.query;
    const events = await mongodb.find({ date });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

//handle input
app.post('/events', async (req, res) => {
    try {
      const { date, description } = req.body;
      const newEvent = new mongodb({ date, description });
      await newEvent.save();
      res.status(201).json(newEvent);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
});

//handle update
app.put('/events/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { description } = req.body;
      const updatedEvent = await mongodb.findByIdAndUpdate(id, { description }, { new: true });
      res.json(updatedEvent);
    } catch (error) {
      console.error('Error updating event:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

//handle delete
app.delete('/events/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await mongodb.findByIdAndDelete(id);
      res.sendStatus(204);
    } catch (error) {
      console.error('Error deleting event:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

app.get('/pdf', async (req, res) => {
    try {
    const { date } = req.query;
    const events = await mongodb.find({ date });
    console.log('RESSSS', events)

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="events_${date}.pdf"`);

    const doc = new PDFDocuments();
    
    doc.pipe(res);

    doc.fontSize(20).text(`Events for ${date}`, { align: 'center' });
    events.forEach((event, index) => {
      doc.fontSize(14).text(`${index + 1}. ${event.description}`);
    });
    doc.end();
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

//untuk handle excel
app.get('/xls', async (req, res) => {
    try {
      const { date } = req.query;
      const events = await mongodb.find({ date });
    
        //console.log('EVENTS', events)
     
      const ws = XLSX.utils.json_to_sheet(events.map(event => 
        // console.log('EVENTEVENT', event)
        ({ Date: event.date, Description: event.description })));

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Events');
  
      
      const tempFilePath = `./temp/events_${date}.xlsx`;
      XLSX.writeFile(wb, tempFilePath);
  
      
      res.download(tempFilePath, `events_${date}.xlsx`, () => {
        
        fs.unlinkSync(tempFilePath);
      });
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

app.use(cors())
  


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});