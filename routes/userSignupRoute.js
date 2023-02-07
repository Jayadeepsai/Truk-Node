//first import the express
const express = require("express");
//define the router
 const router = express.Router();
//next mongoose is required
const mongoose = require("mongoose");
//express validator
const { body } = require('express-validator'); //use express validator for few required things

//import the schema here
const UserSignup = require('../models/userSignup');



//post method goes here
router.post('/signup', [body('email').isEmail().normalizeEmail()],(req, res, next)=>{
    console.log("User profile is called")

    const userSignup = new UserSignup({
        _id: new mongoose.Types.ObjectId,
        role: req.body.role, 
        companyName: req.body.companyName,
        mobileNo: req.body.mobileno,
        city:  req.body.city,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        //Upto above is for normal user signup
        routes:req.body.routes

        // email: req.body.email

           });

     var  mobileNo = req.body.mobileno;
  //first check if user is alredy existed with the mobile no
  UserSignup.findOne({mobileNo:mobileNo}).select().exec().then(doc =>{
    console.log(doc);
    if(doc == null){ //if no user found then create new user
        userSignup.save().then( result=> {
            res.status(200).json({
               message: "User signed up susccessfully",
               status:"success",
               Id: result._id
            });
  
     }) .catch(err => {
        console.log(err);
        res.status(500).json({
             error: err
              });
         })

    }else{
        res.status(300).json({message:"user aleredy exists",
                              status:"failed"
    
                             })
    }
    

    });


});
 




//login flow
router.post('/login', (req, res, next)=>{
   var mobileNo=req.body.mobileno;
    console.log(mobileNo)
   UserSignup.findOne({mobileNo:mobileNo}).select().exec().then( doc => {
    console.log(mobileNo)
    var user  = req.body.mobileno;
    ///var pass  = req.body.password;
    console.log(doc);
    
    //after getting the doc compare username and password
    if(user == doc.mobileNo){
      res.status(200).json({Authentication: doc._id,
                             message: "Success",
                            userProfile:doc,
                            role:doc.role})
    }
    else
    { 
        res.status(400).json({ 
            Authentication: 'Failed to login please check username and password',
            message:'failed'
                            });

    }
   }).catch(err => {
       console.log(err);
       res.status(500).json({error: err});
   });


});




//get user profile
router.get('/:username', (req, res, next) =>{
    UserSignup.findOne({username:req.params.username})
    .exec()
    .then(doc =>{
     
        res.status(200).json({
            userName: doc.username,
            FirstName: doc.firstName,
            lastName: doc.lastName,
            mobileno: doc.mobileNo,
            address: doc.address
           });
 
    })
    .catch(err =>{
        res.status(500).json({
          error: err,
          message:"profile Not Found"
        });
    });
 
     
 });
 





      
    

module.exports = router;