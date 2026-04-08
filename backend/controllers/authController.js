const User = require("../models/User");

exports.registerUser = async (req,res)=>{

 try{

  const user = new User(req.body);

  await user.save();

  res.json({message:"User registered successfully"});

 }catch(error){

  res.status(500).json({message:"Error registering user"});

 }

};