const express = require('express');
const mongoose = require('mongoose');
const mongodb = require('./model');
const cors = require('cors')

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
  


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});