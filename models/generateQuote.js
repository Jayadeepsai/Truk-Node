//get the reuired libraries
const mongoose= require("mongoose");

//introduce bigs array as part of this quote generate schema for accesing the bids later
const bidsData=mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    mobileNo:{type: Number},
    Bidprice: {type: Array},
    Negotiate:{type: Array},
    tentativefinalPrice:{type: Number}
})



//define the schema here
const generateQuoteSchema = mongoose.Schema({
    //define the object ID
   _id: mongoose.Schema.Types.ObjectId,
   OriginLocation:{
    type:String,
    //required:true
},
DestinationLocation:{
    type:String,
   // required:true
},
Number:{
    type:String,
   // required:true
},
product:{
    type:Array,
    //required:true
},
Quantity:{
    type:String,
    //required:true
},

// vehicle:{
//     type:Array,
//     required:true
// },

expectedPrice:{
    type:String,
   // required:true
},

date:{
    type:String,
    //required:true
},
 
typeOfPay:{
    type:Array,
    //required:true
},

length:{
    type:String,
   // required:true
},

breadth:{
    type:String,
   // required:true
},

height:{
    type:String,
   // required:true
},

comments:{
    type:String,
   // required:true
},

data:{
    type:String
},

isActive:{
    type:String,
    default:'Active'
},
   
   
   quoteSentTo:{type: Array, required: true},
   bids:[bidsData]
});


//export this mongoose module
module.exports = mongoose.model('generateQuote', generateQuoteSchema);