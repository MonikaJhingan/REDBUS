const mongoose = require('mongoose');


const TicketSchema=new mongoose.Schema({
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    },
    seatNo:{
      type:Number,
      required:true
    },
    name:{
      type: String,
      required: true

    },
    gender:{
      type: String,
      required: true
    },
    age:{
      type: Number,
      required: true,

    },
    email:{
      type: String,
      required: true,
      unique: true

    },
    phoneNo:{
      type: Number,
      required: true,
      unique: true

    },
    source:{
      type: String,
      required: true

    },
    destination:{
      type: String,
      required: true
    },
    arrivalTime:{
      type: String,
      required: true
    },
    date: {
      type: String,
    },
    price:{
      type: Number,
      required: true

    },
    modeOfPayment:{
      type: String,
      required: true
    },
    isBooked: { 
      type: Boolean,
      default: true },


})

module.exports = mongoose.model('ticket', TicketSchema);
