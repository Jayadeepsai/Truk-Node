const express = require('express');
const load = require('../models/postLoad')

const router = new express.Router()
const mongoose = require('mongoose');

router.post('/post', async (req, res) => {

    const Load = new load({
        _id: new mongoose.Types.ObjectId,
        OriginLocation: req.body.OriginLocation,
        DestinationLocation: req.body.DestinationLocation,
        Number: req.body.Number,
        product: req.body.product,
        Quantity: req.body.Quantity,
        //vehicle: req.body.vehicle,
        expectedPrice: req.body.expectedPrice,
        date: req.body.date,
        typeOfPay:req.body.typeOfPay,
        length:req.body.length,
        breadth:req.body.breadth,
        height:req.body.height,
        comments:req.body.comments,
        data:req.body.data


    })

    try {
        await Load.save()

        res.status(201).json({
            registeredLoad: Load
        })
    } catch (error) {
        console.log(error)
        res.status(401).json(error)
    }
});


router.get('/allLoads', async (req, res) => {
    try {
        const Load = await load.find()


        res.status(200).json({
            TotalProducts: Load.length,
            Load
        })
    } catch (error) {
        res.status(401).send(error)
    }
});


router.put('/loads/:id', async (req, res) => {
    const updates = Object.keys(req.body) //keys will be stored in updates ==> req body fields
    const allowedUpdates = ['OriginLocation', 'DestinationLocation','Number','product','Quantity','expectedPrice',
'date','typeOfPay','length','breadth','height','comments','data'] // updates that are allowed
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update)) // validating the written key in req.body with the allowed updates
    if (!isValidOperation) {
        return res.status(400).json({ error: 'invalid updates' })
    }
    try { // used to catch errors
        const product = await load.findOne({ _id: req.params.id }) //finding the products based on id
        if (!product) {
            return res.status(404).json({ message: 'Invalid Product' }) //error status
        }
        updates.forEach((update) => product[update] = req.body[update]) //updating the value

        await product.save()
        res.status(400).json({
            updatedProduct: product
        })
    } catch (error) {
        res.status(400).json({ error })
    }
})


router.put('/loadDeactivate/:id', async (req, res) => {
    const updates = Object.keys(req.body) //keys will be stored in updates ==> req body fields
    const allowedUpdates = ['isActive'] // updates that are allowed
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update)) // validating the written key in req.body with the allowed updates
    if (!isValidOperation) {
        return res.status(400).json({ error: 'invalid updates' })
    }
    try { // used to catch errors
        const product = await load.findOne({ _id: req.params.id }) //finding the products based on id
        if (!product) {
            return res.status(404).json({ message: 'Invalid Product' }) //error status
        }
        updates.forEach((update) => product[update] = "Deactive") //updating the value

        await product.save()
        res.status(400).json({
            updatedProduct: product
        })
    } catch (error) {
        res.status(400).json({ error })
    }
})



module.exports = router;