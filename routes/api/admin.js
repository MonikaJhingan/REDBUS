const express=require('express');
const router=express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const normalize = require('normalize-url');


const Admin = require('../../models/Admin');

// @route    POST api/admin
// @desc     Register admin
// @access   Public
router.post(
   '/',
   check('name', 'Name is required').notEmpty(),
   check('companyName', 'CompanyName is required').notEmpty(),
   check('email', 'Please include a valid email').isEmail(),
   check(
     'password',
     'Please enter a password with 6 or more characters'
   ).isLength({ min: 6 }),
   async (req, res) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() });
     }

     const { name, companyName, email, password } = req.body;  // Destructured means pulled name emaila nd password from rq.body


try{
   //   1.See if user exists.

   let admin = await Admin.findOne({ email });

      if (admin) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Admin already exists' }] });
      }


    admin = new Admin({
      name,
      companyName,
      email,
      isAdmin:true,
      password,
    });
   //   3.encrypt password

   const salt = await bcrypt.genSalt(10);

   admin.password = await bcrypt.hash(password, salt);

   await admin.save();

   //   4 return jsonwebtoken
   const payload = {
      admin: {
        id: admin.id
      }
    };
   jwt.sign(
      payload,
      config.get('jwtSecret'),
      { expiresIn: '5 days' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );


}catch(err)
{
   console.error(err.message);
   res.status(500).send('Server error');

}
   })

module.exports=router;
