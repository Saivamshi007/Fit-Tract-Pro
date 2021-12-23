const express=require('express');
const router=express.Router();
const auth=require('../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const User=require('../models/User')

router.get('/',auth,async (req,res)=>{
    console.log(req.body);
    {
        try{
            const user=await User.findById(req.user.id).select('-password');

            res.json(user)

        }catch(err){
            console.error(err.message);
            res.status(500).send('Server error');


        }
    }
});

//1og in

router.post(
    '/',
    [
      check('email', 'Please enter a valid Email').isEmail(),
      check('password', 'Minimum 6 character Length').exists(),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errros: errors.array() });
  
      }
  
      const {  password, email } = req.body;
  
      try {
        let user = await User.findOne({ email });
  
        if (!user) {
          return res
            .status(400)
            .json({ errors: [{ msg: 'Invalid Credentials' },{usertoken:"gtoken"}] });
        }
  
        
        const isMatch=await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res
            .status(400)
            .json({ errors: [{ msg: 'Invalid Credentials' },{usertoken:"gtoken"}] });
        }
  
        const payload = {
          user: {
            id: user.id,
          },
        };
  
        jwt.sign(
          payload,
          config.get('jwtSecret'),
          {
            expiresIn: 360000,
          },
          (err, token) => {
            if (err) throw err;
            gtoken=token;
  
            res.json({ token });
          }
        );
      } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');
      }
    }
  );


module.exports=router; 