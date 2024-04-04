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

app.get('/events', async (req, res) => {
  try {
    const { date } = req.query;
    const events = await mongodb.find({ date });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

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


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});