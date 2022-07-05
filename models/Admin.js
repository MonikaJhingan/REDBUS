const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  companyName: {
   type: String,
   required: true
 },
  email: {
    type: String,
    required: true,
    unique: true
  },
  isAdmin: {
   type: Boolean,
   required: true,
 },
  password: {
    type: String,
    required: true
  } 
  
  

});

module.exports = mongoose.model('admin', AdminSchema);
