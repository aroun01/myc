const mongoose = require('mongoose');

const supportSchema = new mongoose.Schema({
  title: String,
  description: String,
  fullname: String,
  telefonnumber: Number,
  email: String,
  status: {
    type: Number,
    default: 0
  },
});

const SupportModel = mongoose.model('Support', supportSchema);

module.exports = SupportModel;