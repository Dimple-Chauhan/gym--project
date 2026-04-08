const mongoose = require("mongoose");

const connectDB = async () => {

try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Atlas connected");

} catch (error) {

    console.log("Database connection error:", error);

}

};

module.exports = connectDB;