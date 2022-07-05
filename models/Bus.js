const mongoose = require('mongoose');

const BusSchema = new mongoose.Schema({
   admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'admin'
    },
  busName: {
    type: String,
    required: true
  },
  busNumber: {
    type: String,
    required: true,
   //  unique: number
  },
  date: {
    type: String,
  },
  time: {
    type: String,
    required: true
  },
  arrivalTime: {
   type: String,
   required: true
 },
 departureTime: {
   type: String,
   required: true
 },
 source:{
  type:String,
  required:true
 },
 destination:{
  type:String,
  required:true
 },
});

module.exports = mongoose.model('bus', BusSchema);
