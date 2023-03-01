//in this we will take the user from location and to location and create a algorithm to create a quote

// db.inventory.find( { areas: { $all: ["warangal", "delhi"] } } )


// db.inventory.insertMany([
//     { agent: "venkateshwara", qty: 4, areas: ["warangal", "bhupapally", "mahabubabad"], dim_cm: [ 14, 21 ] },
//     { agent: "mukta", qty: 5, areas: ["warangal", "bhupalpally","miryalaguda", "gandhinagar"], dim_cm: [ 14, 21 ] },
//     { agent: "crosser", qty: 10, areas: ["warangal", "bhupalpally","miryalaguda", "gandhinagar", "uppal", "vijayawada", "chennai"], dim_cm: [ 14, 21 ] },
//     { agent: "kalamani", qty: 8, areas: ["warangal", "bhupalpally","miryalaguda", "gandhinagar", "delhi"], dim_cm: [ 22.85, 30 ] },
//     { agent: "balaji", qty: 20, areas: ["warangal", "bhupalpally","miryalaguda", "gandhinagar", "delhi"], dim_cm: [ 10, 15.25 ] }
//  ]);

//first import the express
const express = require("express");
//define the router
const router = express.Router();
//next mongoose is required
const mongoose = require("mongoose");
//express validator
const { body } = require('express-validator'); //use express validator for few required things

//import the schema here
const quoteGenerate = require('../models/generateQuote');
const { db } = require("../models/generateQuote");
const UserSignup = require("../models/userSignup");
const generateQuote = require("../models/generateQuote");




//post method goes here
router.post('/generateQuote', (req, res, next) => {
    console.log("generate quotes api is called")


    //find the agents avaibale in the given locations
    UserSignup.find({ routes: { $all: [ req.body.pickupState,  req.body.dropupState] } }).select().exec().then(doc => {
        console.log(doc.length)

        if (doc.length) { //if no provider available then throw error
            //get the list of peeple here loop throuh each doc and get the 
            var provider = []; //provider be an empty array first
            for (item of doc) {
                console.log(item.mobileNo);
                provider.push(item.mobileNo)
                console.log(provider)
            }

            //insert empty array of bids
            var bids;

            //get the details for the quote generating
            const quote = new quoteGenerate({
                _id: new mongoose.Types.ObjectId,
                OriginLocation: req.body.OriginLocation,
                Number: req.body.Number,
                DestinationLocation: req.body.DestinationLocation,
                product: req.body.product,
                Quantity: req.body.Quantity,
                pickupState: req.body.pickupState,
                dropupState: req.body.dropupState,
                data: req.body.data,
                expectedPrice: req.body.expectedPrice,
                date: req.body.date,
                typeOfPay: req.body.typeOfPay,
                length: req.body.length,
                breadth: req.body.breadth,
                height: req.body.height,
                comments: req.body.comments,
                quoteStatus: req.body.quoteStatus,
                quoteSentTo: provider,
                bids: bids
            });

            quote.save().then(result => {
                console.log(quote);
                //send mobile notification to every user in the array with their quote ID in notification
                res.status(200).json({
                    message: "quote generate and sent succeesfully",
                    status: "success",
                    Id: result._id
                });

            }).catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err,
                    status: "failed",
                    message: "failed to generateQuote"
                });
            })

        } else { //when no provider available
            res.status(200).json({
                status: "failed",
                message: "no providers available"
            })
        }

    })


});


//all Loads

router.post('/allQuotes', async (req, res) => {
    quoteGenerate.find({ quoteSentTo: req.body.mobileNo }).select().exec().then(
        doc => {
            console.log(doc)
            //check if it has matching docs then send response
            if (doc.length) {
                res.status(200).json({
                    data: doc,
                    message: "got the matching loads based on the profile",
                    status: "success"
                })
            } else {
                res.status(200).json({
                    message: "no matching loads found",
                    status: "success"
                })

            }
        }
    ).catch(err => {
        res.status.json({
            message: "failed to get loads",
            status: "failed",
            error: err
        })
    })
});

//Loads in mkyloads tab for specific user number

router.post('/myLoadsForSpecificNumber', (req, res, next) => {
    quoteGenerate.find({ Number: req.body.Number }).select().exec().then(
        doc => {
            console.log(doc)
            //check if it has matching docs then send response
            if (doc.length) {
                res.status(200).json({
                    Loads:doc.length,
                    data: doc,
                    message: "got the matching loads based on the profile",
                    status: "success"
                })
            } else {
                res.status(200).json({
                    message: "no matching loads found",
                    status: "success"
                })

            }
        }
    ).catch(err => {
        res.status.json({
            message: "failed to get loads",
            status: "failed",
            error: err
        })
    })
})

//get by id

router.get('/quoteById/:id', async (req, res) => {
    try {
        const quote = await quoteGenerate.find({ _id: req.params.id })
        console.log(quote)
        if (!quote) {
            res.status(404).send({ error: " not found" })
        }
        res.status(200).json(quote)
    } catch (error) {
        res.status(401).json(error)
    }
})

//update Load

router.put('/updateQuotes/:id', async (req, res) => {
    const updates = Object.keys(req.body) //keys will be stored in updates ==> req body fields
    const allowedUpdates = ['OriginLocation', 'DestinationLocation', 'Number', 'product', 'Quantity', 'expectedPrice',
        'date', 'typeOfPay', 'length', 'breadth', 'height', 'comments', 'data','pickupState','dropupState'] // updates that are allowed
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update)) // validating the written key in req.body with the allowed updates
    if (!isValidOperation) {
        return res.status(400).json({ error: 'invalid updates' })
    }
    try { // used to catch errors
        const product = await quoteGenerate.findOne({ _id: req.params.id }) //finding the products based on id
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

//Isactive to Deactive Funtion


router.put('/quoteDeactivate/:id', async (req, res) => {
    const updates = Object.keys(req.body) //keys will be stored in updates ==> req body fields
    const allowedUpdates = ['isActive'] // updates that are allowed
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update)) // validating the written key in req.body with the allowed updates
    if (!isValidOperation) {
        return res.status(400).json({ error: 'invalid updates' })
    }
    try { // used to catch errors
        const product = await quoteGenerate.find({ _id: req.params.id }) //finding the products based on id
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
});

//Get the load by status and mobile number

router.post('/loadsByStatusAndNumber', async (req, res) => {
    const quote = await quoteGenerate.find()
  
    var filter= quote.filter(data=>{
     return data.Number==req.body.Number
    })
    
   // console.log(filter)
    
    try {
      //  const load = await array.find({ isActive: req.params.isActive })
      var load = filter.filter(data=>{
        return data.isActive == req.body.isActive
      })
      console.log(load)
        if (!load) {
            res.status(404).send({ error: "Loads not found" })
        }
        res.status(400).json({
            TotalLoads: load.length,
            load
        })
    } catch (error) {
        res.status(401).json({ error })
        console.log(error)
    }
})






function sendQuote(orgin, destination) {
    // userSignup.find()
    UserSignup.find({ routes: { $all: ["Warangal", "delhi"] } }).select().exec().then(doc => {
        console.log(doc)
    })


}




//LoadMarket APIS where trukers and agents get to see the loads based on their profile. 
router.post('/LoadMarket', (req, res, next) => {
    quoteGenerate.find({quoteSentTo: { $all: [req.body.mobileNo] } }).select().exec().then(
        doc => {
            console.log(doc)
            var load = doc.filter(data=>{
                return data.isActive == req.body.isActive
              })
            //check if it has matching docs then send response
            if (load.length) {
                res.status(200).json({
                    item: load,
                    message: "got the matching loads based on the profile",
                    status: "success"
                })
            } else {
                res.status(200).json({
                    message: "no matching loads found",
                    status: "success"
                })

            }
        }
    ).catch(err => {
        res.status.json({
            message: "failed to get loads",
            status: "failed",
            error: err
        })
    })
})




//place bids by truckers or agents
//get the ID, update the bids array with 
// Bids:[{
//    _id:doc.id
//    mobileNo:6207196729,
//    Bidprice: 5000,
//    Negotiate:3000,
//    tentativefinalPrice:4000

// }]
/**
 * once the load is generated by the user then a agent can bid for the quote
 * and user can negotiate the bid.
 * 
 */
router.post('/placeBid', (req, res, next)=>{

    /***
     * case 1:  place bid by the Trucker
     *  MobileNo, BidPrice and QuoteID. 
     *  
     * Case 2: now customer can see the bid value and clicks on negotiate
     * and sends negotaited price
     * bid id, Negotiated price
     * 
     */
     //this is initial place Bid, this first time bid we are sending only trucke quotes for the bid
     // const placeBid ={    //NOT USING THIS ONE FOR NOW 
     //     _id: new mongoose.Types.ObjectId,
     //     mobileNo:req.body.mobileNo,
     //     Bidprice: [{"price":req.body.Bidprice, "time": new Date().getTime()}],
     //     Negotiate:[],
     //     tentativefinalPrice: req.body.Bidprice,  //first time placed bid by trucker
     //     time: new Date().getTime()
     // }
   
    //alternate bid Current Bid Service
    const placeIniBid ={
     _id: new mongoose.Types.ObjectId,
     mobileNo:req.body.mobileNo,
     BidActivity: [{"price":req.body.Bidprice,
                 "userNo": req.body.mobileNo,
                 "initialAccept":req.body.initialAccept,
                 "userType":req.body.userType,  //this only for trucker side for the first time.
                 "time": new Date().getTime()}],
     tentativefinalPrice: req.body.Bidprice,  //first time placed bid by trucker
     time: new Date().getTime()
 }
 
      
 
 
       //form the query here
       var query=   { $push: { bids: placeIniBid }}
 
 
     //find the docID or quote ID
     quoteGenerate.findByIdAndUpdate({_id: req.body._id}, query).select().exec().then(
         doc=>{
             console.log(doc)
             //check if it has matching docs then send response
             if(doc){
             res.status(200).json({
                 data: doc,
                 message:"got the matching loads based on the profile",
                 status:"success"
             })
         }else{
             res.status(200).json({
                 message:"no matching docs found",
                 status:"success"
             })
 
         }
         }
     ).catch(err=>{
         res.status(200).json({
             message:"failed to bid",
             status: "failed",
             error:err
         })
     })
 } )
 
 
 

//Update Bids by the trukers and Customers
// router.post('/updateBids', (req, res, next)=>{

  
//     /** 
//          //trucker update bid if bid is update by the truker
//          const TruckrUpdateBid ={
//              mobileNo:req.body.mobileNo,
//              Bidprice: req.body.price,
//              tentativefinalPrice: req.body.Bidprice,
//              time: new Date().now
//          }
//          //if customer updates the bid
//          const CustomerUpdateBid={
//             Negotiate:req.body.price,
//             tentativefinalPrice: req.body.Bidprice,
//             time: new Date().now
//          }
//       */
    
//         //     console.log(new Date().getTime());
//         //    var query= {"_id":req.body._id,"bids.mobileNo":req.body.mobileNo}  //quote id and truker mobile no  always Agent mobile NO
//         //    //form the query here
//         //    var updateBidPrice=   { $push: { "bids.$.Bidprice":{"price":req.body.price, "time": new Date().getTime()}},
//         //                          $set:{"bids.$.tentativefinalPrice":req.body.price}}
    
//         //    var updateNegotiatePrice={$push:{"bids.$.Negotiate":{"price":req.body.price, "time": new Date().getTime()}},
//         //                         $set:{"bids.$.tentativefinalPrice":req.body.price}}
       
//         //    var updateData="";
    
//            //newUpdate query for bids
//            var DataToBids={
                         
//                           "price":req.body.price,
//                         //   "userNo": req.body.userNo, 
//                           "userType":req.body.userType, 
//                           "time": new Date().getTime()
//            }
//                         //   $set:{"bids.$.tentativefinalPrice":req.body.price}}

//                     //       var obj = {
//                     //         "price":req.body.price,
//                     //         //   "userNo": req.body.userNo, 
//                     //           "userType":req.body.userType, 
//                     //           "time": new Date().getTime()
//                     //       }

//                     //    const data = bids.BidActivity.push(obj)
//                     //    console.log(data)

//                          /* var DataToBids={
//                             BidActivity: [{"price":req.body.price,
//                                         "userNo": req.body.userNo,
//                                         "userType":req.body.userType,  //this only for trucker side for the first time.
//                                         "time": new Date().getTime()}],
//                             $set:{"bids.$.tentativefinalPrice":req.body.price}}*/


                   
            
//         //    if(req.body.isAgent){
//         //       updateData=updateBidPrice;
//         //    }else{
//         //       updateData=updateNegotiatePrice
//         //    }
    
//            console.log(DataToBids)
//            var query=   { $push: { bids: DataToBids }}
//           // { $push: { "bids.$.Bidprice":req.body.price }}
//          //find the docID or quote ID
//          quoteGenerate.findOneAndUpdate({_id: req.body._id}, {$set: {"bids.$.[BidActivity]":DataToBids}}).select().exec().then(
//              doc=>{
//                  console.log(doc)
//                  //check if it has matching docs then send response
//                  if(doc){
//                  res.status(200).json({
//                      data: doc,
//                      message:"got the matching loads based on the profile",
//                      status:"success"
//                  })
//              }else{
//                  res.status(200).json({
//                      message:"no matching docs found",
//                      status:"success"
//                  })
     
//              }
//              }
//          ).catch(err=>{
//              res.status(200).json({
//                  message:"failed to bid",
//                  status: "failed",
//                  error:console.log(err)
//              })

//          }) 
//      } )

     

//Update Bids by the trukers and Customers
router.post('/updateBids', (req, res, next)=>{

  
    /** 
         //trucker update bid if bid is update by the truker
         const TruckrUpdateBid ={
             mobileNo:req.body.mobileNo,
             Bidprice: req.body.price,
             tentativefinalPrice: req.body.Bidprice,
             time: new Date().now
         }
         //if customer updates the bid
         const CustomerUpdateBid={
            Negotiate:req.body.price,
            tentativefinalPrice: req.body.Bidprice,
            time: new Date().now
         }
      */
    
        //     console.log(new Date().getTime());
          var query= {"_id":req.body._id,"bids.mobileNo":req.body.mobileNo}  //quote id and truker mobile no  always Agent mobile NO
        //    //form the query here
        //    var updateBidPrice=   { $push: { "bids.$.Bidprice":{"price":req.body.price, "time": new Date().getTime()}},
        //                          $set:{"bids.$.tentativefinalPrice":req.body.price}}
    
        //    var updateNegotiatePrice={$push:{"bids.$.Negotiate":{"price":req.body.price, "time": new Date().getTime()}},
        //                         $set:{"bids.$.tentativefinalPrice":req.body.price}}
       
        //    var updateData="";
    
           //newUpdate query for bids
           var DataToBids={$push:{ "bids.$.BidActivity":{"price":req.body.price,
                          "userNo": req.body.userNo, 
                          "userType":req.body.userType, 
                          "time": new Date().getTime()}},
                          $set:{"bids.$.tentativefinalPrice":req.body.price}}
            
        //    if(req.body.isAgent){
        //       updateData=updateBidPrice;
        //    }else{
        //       updateData=updateNegotiatePrice
        //    }
    
           console.log(DataToBids)
           console.log(query)
          // { $push: { "bids.$.Bidprice":req.body.price }}
         //find the docID or quote ID
         quoteGenerate.findOneAndUpdate(query,DataToBids).select().exec().then(
             doc=>{
                 console.log(doc)
                 //check if it has matching docs then send response
                 if(doc){
                 res.status(200).json({
                     data: doc,
                     message:"got the matching loads based on the profile",
                     status:"success"
                 })
             }else{
                 res.status(200).json({
                     message:"no matching docs found",
                     status:"success"
                 })
     
             }
             }
         ).catch(err=>{
             res.status(200).json({
                 message:"failed to bid",
                 status: "failed",
                 error:err
             })
         }) 
     } )
     


//ShowBids to customer
router.post('/showCustomerBids', (req, res, next) => {
    quoteGenerate.find({ "userNumber": req.body.mobileNo }).select().exec().then(doc => {
        res.status(200).json({
            status: "success",
            message: "found the bids",
            bids: doc,
            count: doc.length
        })
    })
})


//show agent side bids and this should restrict to only his bids not other bids
router.post('/showAgentBids', (req, res, next) => {
    quoteGenerate.find({ "bids.mobileNo": req.body.mobileNo }).select().exec().then(doc => {
        console.log(doc);

        //accessing particular bids of that user truker only bids accessed here 
        var bidData = [];
        if (doc) {
            var tempData;
            for (item of doc) {
                for (i of item.bids) {
                    if (i.mobileNo == req.body.mobileNo) {
                        console.log(i.mobileNo);
                        var obj = {
                            id: item._id,
                            OriginLocation: req.body.OriginLocation,
                            Number: req.body.Number,
                            DestinationLocation: req.body.DestinationLocation,
                            product: req.body.product,
                            Quantity: req.body.Quantity,
                            state: req.body.state,
                            data: req.body.data,
                            expectedPrice: req.body.expectedPrice,
                            date: req.body.date,
                            typeOfPay: req.body.typeOfPay,
                            length: req.body.length,
                            breadth: req.body.breadth,
                            height: req.body.height,
                            comments: req.body.comments,
                            quoteStatus: item.quoteStatus,
                            quoteBid: i
                        }
                        bidData.push(obj);
                    }

                }
            }



            //console.log(tempData);
            res.status(200).json({
                status: "success",
                message: "found the bids",
                bids: bidData,
                count: doc.length
            })
        } else {
            res.status(200).json({
                status: "failed",
                message: "no bids found"
            })
        }



    })
})

///Show agent side bids for particular QUOTE ID and particular Agent Mobile NO
router.post('/showAgentSideBidConversation', (req, res, next)=>{
    console.log(req.body._id)
    console.log(req.body.mobileNo)
    quoteGenerate.find({"bids.mobileNo":req.body.mobileNo, "_id":req.body._id}).select().exec().then(doc=>{
         console.log(doc);

        //accessing particular bids of that user truker only bids accessed here 
        var bidData=[];
        if(doc){
            var tempData;
           for(item of doc){
            for(i of item.bids){
                if(i.mobileNo==req.body.mobileNo){
                    console.log(i.mobileNo);
                    var obj={
                        id:item._id,
                        OriginLocation:item.OriginLocation,
                        Number:item.Number,
                        DestinationLocation:item.DestinationLocation,
                        product:item.product,
                        Quantity:item.Quantity,
                        state:item.state,
                        data:item.data,
                        expectedPrice:item.expectedPrice,
                        date:item.date,
                        typeOfPay:item.typeOfPay,
                        length:item.length,
                        breadth:item.breadth,
                        height:item.height,
                        comments:item.comments,
                        quoteStatus:item.quoteStatus,
                        quoteBid:i
                    }
                    bidData.push(obj);
                }
                
            }
           }



        //console.log(tempData);
        res.status(200).json({
            status:"success",
            message: "found the bids",
            bids:bidData,
            count:doc.length
        })
    }else{
        res.status(200).json({
            status:"failed",
            message:"no bids found"
        })
    }



    })
})



//Accepting final quote by user
router.post('/acceptQuoteByUser',(req,res,next)=>{

    var query={"_id":req.body._id };
    var update ={$set:{userAcceptedPrice:req.body.acceptedPrice,isActive:"Finalised"}}
    generateQuote.findOneAndUpdate(query,update).select().exec().then(
        doc=>{
            console.log(doc)
            res.status(200).json({
                message:doc,
                status:"success"
            })
        }
    )
})


//initial accept by shipper
router.post('/initialacceptbyshipper',(req,res,next)=>{

    //var query={"_id":req.body._id };
    var query= {"_id":req.body._id,"bids.mobileNo":req.body.mobileNo}
    var update ={$set:{"bids.$.isShipperAccepted":req.body.isShipperAccepted}}
    console.log(update)
    generateQuote.findOneAndUpdate(query,update).select().exec().then(
        doc=>{
            console.log(doc)
            res.status(200).json({
                message:doc,
                status:"success"
            })
        }
    )
})

//final aaccept by agent
router.post('/finalacceptbyagent',(req,res,next)=>{

    //var query={"_id":req.body._id };
    var query= {"_id":req.body._id,"bids.mobileNo":req.body.mobileNo}
    var update ={$set:{"bids.$.isAgentAccepted":req.body.isAgentAccepted}}
    console.log(update)
    generateQuote.findOneAndUpdate(query,update).select().exec().then(
        doc=>{
            console.log(doc)
            res.status(200).json({
                message:doc,
                status:"success"
            })
        }
    )
})


//final aaccept by agent
router.post('/getsingleloadbids',(req,res,next)=>{

    //var query={"_id":req.body._id };
    var query= {"_id":req.body._id}
    
    
    generateQuote.find(query).select().exec().then(
        doc=>{
            console.log(doc)
            res.status(200).json({
                message:doc,
                status:"success"
            })
        }
    )
})











module.exports = router;