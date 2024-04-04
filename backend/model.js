const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  date: String,
  description: String,
});

module.exports = mongoose.model('Event', eventSchema);
