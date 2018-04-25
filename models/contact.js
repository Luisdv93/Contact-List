const mongoose = require('mongoose');

//Schema setup
let contactSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  image: { type: String, default: 'https://picsum.photos/430/280' },
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contact', contactSchema);
