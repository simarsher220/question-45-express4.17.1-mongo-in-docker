var mongoose = require('mongoose');

var LeadSchema = new mongoose.Schema({
  id: String,
  first_name: String,
  last_name: String,
  email: String,
  mobile: Number,
  location_type: String,
  location_string: String,
  status: String,
  communication: String
});

module.exports = mongoose.model('Lead', LeadSchema);
