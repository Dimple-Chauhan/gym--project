const mongoose = require("mongoose");

const trainerSchema = new mongoose.Schema({

 trainerName:String,

 specialization:String,

 experience:Number,

 pricePerSession:Number,

 availableSlots:[String]

});

module.exports = mongoose.model("Trainer", trainerSchema);