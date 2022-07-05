const express=require('express');
const router=express.Router();
const request=require('request');
const config = require('config');
const auth = require('../../middleware/auth'); // for protected routes
const { check, validationResult } = require('express-validator');
const normalize = require('normalize-url');
const checkObjectId = require('../../middleware/checkObjectId');


const Admin = require('../../models/Admin');

const Bus = require("../../models/Bus");

const User = require('../../models/User');

const Ticket=require('../../models/ticket');




// @route    POST api/bus
// @desc     Create or update ticket profile
// @access   Private
router.post(
   '/',
   auth,
   check('seatNo','SeatNumber is required').notEmpty(),
   check('name', 'Name is required').notEmpty(),
   check('gender', 'Gender is required').notEmpty(),
   check('age', 'Age is required').notEmpty(),
   check('email', 'Email is required').notEmpty(),
   check('phoneNo', 'DepartureTime is required').notEmpty(),
   check('source', 'Source is required').notEmpty(),
   check('destination', 'Destination is required').notEmpty(),
   check('arrivalTime', 'ArrivalTime is required').notEmpty(),
   check('date', 'Date is required').notEmpty(),
   check('price', 'Price is required').notEmpty(),
   check('modeOfPayment', 'Price is required').notEmpty(),
   check('isBooked', 'isBooked is required').notEmpty(),


   async (req, res) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() });
     }
 
     const { seatNo,name,gender,age,email,phoneNo,source,destination,arrivalTime,date,price,modeOfPayment} = req.body; 
 
     // build a ticket profile
     try{
      //   1.See if ticket exists.
   
      let ticket = await Ticket.findOne({ 
         is_booked: true,
         seatNo: req.body.seatNo});
   
         if (ticket) {
           return res
             .status(400)
             .json({ errors: [{ msg: 'Ticket already exists/booked.' }] });
         }
   
   
       ticket = new Ticket({
         seatNo,
         name,
         gender,
         age,
         email,
         phoneNo,
         source,
         destination,
         arrivalTime,
         date,
         price,
         modeOfPayment,
         isBooked:true
       });
    
   
      await ticket.save((err, docs) => {
        if (!err) res.send(docs)
        else console.log('Error while creating new record : ' + JSON.stringify(err, undefined, 4))
    })
    }catch(err)
    {
       console.error(err.message);
       res.status(500).send('Server error');
    
    }
       });

 
// @route    GET api/ticket
// @desc     Get all tickets
// @access   Public
router.get('/', async (req, res) => {
   try {
     const tickets = await Ticket.find().populate('user', ['name', 'date']);
     res.json(tickets);
   } catch (err) {
     console.error(err.message);
     res.status(500).send('Server Error');
   }
 });

 
 // @route    GET api/posts/:id
 // @desc     Get post by ID
 // @access   Private
 router.get('/:id', auth, checkObjectId('id'), async (req, res) => {
   try {
     const ticket = await Ticket.findById(req.params.id);
 
     if (!ticket) {
       return res.status(404).json({ msg: 'Ticket not found' });
     }
 
     res.json(ticket);
   } catch (err) {
     console.error(err.message);
 
     res.status(500).send('Server Error');
   }
 });


// @route    DELETE api/ticket/:id
// @desc     Delete a ticket
// @access   Private
router.delete('/:id', [auth, checkObjectId('id')], async (req, res) => {
   try {
     const ticket = await Ticket.findById(req.params.id);
 
     if (!ticket) {
       return res.status(404).json({ msg: 'Ticket not found' });
     }
 
   //   // Check user
   //   let string = string.toString();
   //   if (ticket.user.string!== req.user.id) {
   //     return res.status(401).json({ msg: 'User not authorized' });
   //   }
 
     await ticket.remove();
 
     res.json({ msg: 'Ticket removed' });
   } catch (err) {
     console.error(err.message);
 
     res.status(500).send('Server Error');
   }
 });


 // updating tickets
router.put("/update/:id", [auth, checkObjectId('id')], async (req, res) => {
    let ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, {new : true});

    return res.status(201).send({ticket});
});

// already booked tickets
router.get('/closed',async(req,res)=>{
   try {
       const ticket = await Ticket.find({isBooked:true})
       res.send(ticket)
   } catch (err) {
       console.error(err.message)
       res.status(500).send('Server_Error')
   }
});
 module.exports=router;