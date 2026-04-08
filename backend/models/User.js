const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

 email:{
   type:String,
   required:true,
   unique:true
 },

 password:{
   type:String,
   required:true
 },

 // ✅ ADD THESE
 age: Number,
 height: Number,
 weight: Number,
 diseases: String,

 profileCompleted:{
  type:Boolean,
  default:false
},

 planType:String,
 workoutPlan:String,
 caloriesBurned:Number,
 progressPhotos:[String],

 joinDate:{
   type:Date,
   default:Date.now
 }

});

module.exports = mongoose.model("User", userSchema);