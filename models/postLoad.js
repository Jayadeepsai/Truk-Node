const mongoose = require('mongoose')

const loadSchema = new mongoose.Schema({

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
    }


})

const load = mongoose.model('Item',loadSchema)

module.exports= load