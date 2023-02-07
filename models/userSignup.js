//get the reuired libraries
const mongoose= require("mongoose");

// const subObj={
//     streetName:{type: String, required:true},
//     houseNo:{type: String, required: true},
//     city:{type: String, required:true},
//     state:{type: String, required:true},
//     zipCode:{type: String, required:true},
//     landMark:{type: String}
// } 
 

//define the schema here
const UserProfileSchema = mongoose.Schema({
    //define the object ID
   _id: mongoose.Schema.Types.ObjectId,
   role:{type: String, required: true},  //fleetOwner, Agent, Transporter, customer
   mobileNo: { type: Number, unique:true, required: true },
   companyName:{type: String},
   firstName:  {type:String, required: true},
   lastName:  {type:String, required: true},
   city: {type: String, required: true},
   routes:{type: Array},
  
//    email:{type:String, required: true}
   
});


//export this mongoose module
module.exports = mongoose.model('UserSignUp', UserProfileSchema);