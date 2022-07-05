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


// @route    POST api/bus
// @desc     Create or update bus profile
// @access   Private
router.post(
   '/',
   auth,
   check('busName', 'Busname is required').notEmpty(),
   check('busNumber', 'BusNumber is required').notEmpty(),
   check('date', 'Date is required').notEmpty(),
   check('time', 'Time is required').notEmpty(),
   check('arrivalTime', 'ArrivalTime is required').notEmpty(),
   check('departureTime', 'DepartureTime is required').notEmpty(),
   check('source', 'Source is required').notEmpty(),
   check('destination', 'Destination is required').notEmpty(),

   async (req, res) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() });
     }
 
     const { busName,busNumber,date,time, arrivalTime,departureTime ,source,destination} = req.body; 
 
     // build a bus profile
     try{
      //   1.See if bus exists.
   
      let bus = await Bus.findOne({ busName });
   
         if (bus) {
           return res
             .status(400)
             .json({ errors: [{ msg: 'Bus already exists' }] });
         }
   
   
       bus = new Bus({
         busName,
         busNumber,
         date,
         time,
         arrivalTime,
         departureTime,
         source,
         destination
        //  isAdmin:true,
       });
    
   
      await bus.save((err, docs) => {
        if (!err) res.send(docs)
        else console.log('Error while creating new record : ' + JSON.stringify(err, undefined, 4))
    })
    }catch(err)
    {
       console.error(err.message);
       res.status(500).send('Server error');
    
    }
       });



       
// search bus
router.get('/search', async(req, res)=>{

  let from = req.query.source;
  let to = req.query.destination;
  let arrivalDate = req.query.date
  try{
  let busData = await Bus.findOne({source: from, destination: to,date:arrivalDate});

  if(!busData) 
  return res.status(400).json({msg:"Sorry no Buses available",});


  res.status(200).json(busData)
  // console.log(busData)
  }catch(err){
      console.error(err.message)
      res.json({ error: err })
  }
  
});

// @route    GET api/ticket
// @desc     Get all tickets
// @access   Public
router.get('/',auth, async (req, res) => {
  try {
    const bus = await Bus.find().populate('admin', ['busName', 'date']);
    res.json(bus);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/bus/:id
 // @desc     Get ticket by ID
 // @access   Private
 router.get('/:id', auth, checkObjectId('id'), async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);

    if (!bus) {
      return res.status(404).json({ msg: 'Bus not found' });
    }

    res.json(bus);
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});

// @route    DELETE api/bus/:id
// @desc     Delete a bus
// @access   Private
router.delete('/:id', [auth, checkObjectId('id')], async (req, res) => {
   try {
     const bus = await Bus.findById(req.params.id);
 
     if (!bus) {
       return res.status(404).json({ msg: 'Bus not found' });
     }
     await bus.remove();
 
     res.json({ msg: 'Bus removed' });
   } catch (err) {
     console.error(err.message);
 
     res.status(500).send('Server Error');
   }
 });

 
// updating buses
router.put("/update/:id", [auth, checkObjectId('id')], async (req, res) => {
  let bus = await Bus.findByIdAndUpdate(req.params.id, req.body, {new : true});

  return res.status(201).send({bus});
});
    

 module.exports=router;