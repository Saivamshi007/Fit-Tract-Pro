const express=require('express');
const router=express.Router();
const auth=require('../middleware/auth');
const Profile = require('../models/Profile');
const user=require('../models/User');
const {check,validationResult}=require('express-validator');
const { route } = require('./auth');
const User = require('../models/User');

router.get('/me',auth,async (req,res)=>{
    
    try{

        const profile=await Profile.findOne({user:req.user.id}).populate('user',
        ['name',
        'avatar']);

        if(!profile){
            return res.status(500).json({msg:'Profile doesnot exists'});
        }

    }catch(err){
        console.log(err.message);
        res.status(500).send('Server Error');
    }


}); 

//post request update profile
router.post('/',auth,async (req,res)=>{
    const{Favece,PR}=req.body;
    const profileFields={};
    profileFields.user=req.user.id;

    if(Favece)profileFields.Favece=Favece;
    if(PR)profileFields.PR=PR;

    try{

        let profile=await Profile.findOne({user:req.user.id });

        if(profile){

            profile=await Profile.findOneAndUpdate({
                user:req.user.id},
                {$set:profileFields},
                {new:true}
                );

                return res.json(profile);

        }

        //Create new Profile
        profile=new Profile(profileFields);

        await profile.save();

        res.json(profile); 


    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})
//route to get all profiles
router.get('/allProfiles',async (req,res)=>{
    try {
        const profile= await Profile.find().populate('user',['name','avatar']);
        res.json(profile);
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
        
    }

} );
//Get profile using id
router.get('/user/:user_id',async (req,res)=>{
    try {
        const profile= await Profile.findOne({user:req.params.user_id}).populate('user',['name','avatar']);
        
        if(!profile)
            return res.status(400).json({msg:'There is profile for this user'});


        res.json(profile); 
        
    } catch (err) {
        console.error(err.message);
        if(err.kind=='ObjectId')
            return res.status(400).json({msg:'There is profile for this user'});

        res.status(500).send('Server error');
        
    }

} );

//Delete profile

router.delete('/',auth,async(req,res)=>{
    try {
        //remove profile
        await Profile.findOneAndRemove({user:req.user.id});
        //remove user
        await User.findOneAndRemove({_id:req.user.id});

        res.json({msg:'User is deleted'});
        
    } catch (err) {
        console.log(err.message);
        res.status(400).send('Server Error');
        
    }
});
  

module.exports=router;