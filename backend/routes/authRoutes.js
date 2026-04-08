const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const authMiddleware = require("../middleware/authMiddleware");

// REGISTER
router.post("/register", async (req, res) => {

    const email = req.body.email.trim().toLowerCase();
    const password = req.body.password;

    try {

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.json({
                success: false,
                message: "Account already exists"
            });
        }

        // HASH PASSWORD
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            password: hashedPassword
        });

        await newUser.save();

        res.json({
            success: true
        });

    } catch (error) {

        console.log(error);

        res.json({
            success: false,
            message: "Server error"
        });

    }

});



//Profile
router.post("/profile", authMiddleware, async (req,res)=>{

    const { age, height, weight, diseases } = req.body;

    try{

        const user = await User.findById(req.userId);
        user.age = age;
        user.height = height;
        user.weight = weight;
        user.diseases = diseases;

        user.profileCompleted = true;

        await user.save();

        res.json({
            success:true
        });

    }catch(error){

        res.json({
            success:false,
            message:"Error saving profile"
        });

    }

});



// LOGIN
router.post("/login", async (req,res)=>{

    const email = req.body.email.trim().toLowerCase();
    const password = req.body.password;

    try{

        const user = await User.findOne({email});

        if(!user){
            return res.json({
                success:false,
                message:"User not found"
            });
        }

        // COMPARE PASSWORD
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.json({
                success:false,
                message:"Invalid password"
            });
        }

    const jwt = require("jsonwebtoken");

    const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    res.json({
        success:true,
        token: token,
        profileCompleted: user.profileCompleted
    });

    }catch(error){

        res.json({
            success:false,
            message:"Server error"
        });

    }

});


//JWT TOKEN

router.get("/profile", authMiddleware, async (req,res)=>{

    try{

        const user = await User.findById(req.userId).select("-password");

        res.json({
            success:true,
            user
        });

    }catch(error){

        res.json({
            success:false,
            message:"Error fetching user"
        });

    }

});


// FORGOT PASSWORD (RESET)
router.post("/forgot-password", async (req, res) => {

    const email = req.body.email.trim().toLowerCase();
    const newPassword = req.body.newPassword;

    try {

        const user = await User.findOne({ email });

        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        // HASH NEW PASSWORD
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;

        await user.save();

        res.json({
            success: true,
            message: "Password updated successfully"
        });

    } catch (error) {

        console.log(error);

        res.json({
            success: false,
            message: "Server error"
        });

    }

});


module.exports = router;