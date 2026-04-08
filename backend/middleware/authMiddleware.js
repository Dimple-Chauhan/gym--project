const jwt = require("jsonwebtoken");

const authMiddleware = (req,res,next)=>{

    const token = req.headers.authorization;

    if(!token){
        return res.json({
            success:false,
            message:"No token"
        });
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // ✅ KEEP YOUR OLD SYSTEM
        req.userId = decoded.id;   // 🔥 THIS IS THE ONLY CHANGE

        next();

    }catch(error){
        return res.json({
            success:false,
            message:"Invalid token"
        });
    }

};

module.exports = authMiddleware;