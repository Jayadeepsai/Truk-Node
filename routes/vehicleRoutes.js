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
const AddVehicle= require('../models/vehicle');
const vehicle = require("../models/vehicle");
const { response } = require("../app");






router.post('/vehiclepost', async(req, res, next) => {        // want to create product details
    const vehicle = new AddVehicle({
        trukvehiclenumber: req.body.trukvehiclenumber,
        trukcurrentLocation: req.body.trukcurrentLocation,
        trukoperatingRoutes: req.body.trukoperatingRoutes,
        trukcapacity: req.body.trukcapacity,
        trukOwnerNumber:req.body.trukOwnerNumber,
        trukname: req.body.trukname,
        trukdate:req.body.trukdate,
       


    });
    try {
        await vehicle.save()
        

        res.status(201).json({
            registeredVehicle: vehicle
        })
        
    } catch (error) {
        console.log(error)
        res.status(401).json(error)
    }

})
//get vehicles
router.get('/allVehicles', async (req, res) => {
    try {
        const Load = await AddVehicle.find()


        res.status(200).json({
            TotalProducts: Load.length,
            Load
        })
    } catch (error) {
        res.status(401).send(error)
    }
});

//Get the truks by status and mobile number

router.post('/truksByStatusAndNumber', async (req, res) => {
    const truk = await AddVehicle.find()
  
    var filter= truk.filter(data=>{
     return data.trukOwnerNumber==req.body.trukOwnerNumber
    })
    
   // console.log(filter)
    
    try {
      //  const load = await array.find({ isActive: req.params.isActive })
      var vehicle = filter.filter(data=>{
        return data.trukisActive == req.body.trukisActive
      })
      console.log(vehicle)
        if (!vehicle) {
            res.status(404).send({ error: "Vehicles not found" })
        }
        res.status(200).json({
            TotalVehicles: vehicle.length,
            vehicle
        })
    } catch (error) {
        res.status(401).json({ error })
        console.log(error)
    }
})



//filterByVehicle API 
router.get('/filterByVehicle/:trukname/:trukpickupLocation/:trukdropLocation', async (req, res) => {
    try {
        const vehicle = await AddVehicle.find({trukname:req.params.trukname, trukoperatingRoutes: { $all: [req.params.trukpickupLocation, req.params.trukdropLocation]  }})
       
if(!vehicle){
    res.status(404).json({message:"Vehicle not fount"})
}

        res.status(200).json({
           
            vehicle
        })
    } catch (error) {
        res.status(401).send(error) 
    }
});

// GetbymobileNo API

 router.get('/allVehicles/:trukOwnerNumber', (req, res, next)=>{

    AddVehicle.find({trukOwnerNumber:req.params.trukOwnerNumber}).exec().then(
         docs =>{
             res.status(200).json({
                        data: docs
                     })

             }).catch(err =>{
        res.status(500).json({
            error: err
        })
    });

}) 


//update API

router.put('/updateLoads/:id', async (req, res) => {
    const updates = Object.keys(req.body) //keys will be stored in updates ==> req body fields
    const allowedUpdates = ['trukvehiclenumber', 'trukcurrentLocation','trukoperatingRoutes','trukcapacity','trukname','trukdate','trukOwnerNumber'] // updates that are allowed
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update)) // validating the written key in req.body with the allowed updates
    if (!isValidOperation) {
        console.log(isValidOperation)
        return res.status(400).json({ error: 'invalid updates' })
    }
    try { // used to catch errors
        const product = await AddVehicle.findOne({ _id: req.params.id }) //finding the products based on id
        if (!product) {
            return res.status(404).json({ message: 'Invalid Product' }) //error status
        }
        updates.forEach((update) => product[update] = req.body[update]) //updating the value

        await product.save()
        res.status(200).json({
            updatedProduct: product
        })
    } catch (error) {
        res.status(400).json({ error })
    }
})
// deactive API
router.put('/TrukDeactive/:id', async (req, res) => {
    const updates = Object.keys(req.body) //keys will be stored in updates ==> req body fields
    const allowedUpdates = ['trukisActive'] // updates that are allowed
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update)) // validating the written key in req.body with the allowed updates
    if (!isValidOperation) {
        console.log(isValidOperation)
        return res.status(400).json({ error: 'invalid updates' })
    }
    try { // used to catch errors
        const product = await AddVehicle.findOne({ _id: req.params.id }) //finding the products based on id
        if (!product) {
            return res.status(404).json({ message: 'Invalid Product' }) //error status
        }
        updates.forEach((update) => product[update] = req.body[update]) //updating the value

        await product.save()
        res.status(200).json({
            updatedProduct: product
        })
    } catch (error) {
        res.status(400).json({ error })
    }
})

//delete API
router.delete('/deleteTruk/:_id' ,async(req,res)=> {
    try{
        const deletedProduct = await AddVehicle.findByIdAndDelete ( {_id:req.params._id} )
        if(!deletedProduct) {
            res.status(404).json({error: "Product not found"})

        }
        res.status(400).json({message: "Product Deleted",
        deletedProduct})
    } catch (error) {
        res.status(400).send (error)
    }
    
})
//Get the truk by isActive

router.get('/trukByStatus/:trukisActive',async(req,res)=>{
    try{
        const vehicle= await AddVehicle.find({trukisActive:req.params.trukisActive})
        if(!vehicle){
            res.status(404).send({error: "truks not found"})
        }
        res.status(400).json({
            TotalLoads:vehicle.length,
            vehicle})
    }catch(error){
        res.status(401).json({error})
        console.log(error)
    }
})

//show truks in truk market


// UserSignup.find({routes: { $all: ["Warangal", "delhi"] } } ).select().exec().then(doc =>{ 
//    console.log(doc.length)

// })


// vehicle search based on location
router.post('/vehicleSearch', async(req, res, next) => {   
   
    vehicle.find({trukoperatingRoutes: { $all: [req.body.trukpickupLocation, req.body.trukdropLocation] } } ).select().exec().then(doc =>{ 
        console.log(doc.length)
     
        res.status(400).json({
           doc})
     })

})



module.exports= router