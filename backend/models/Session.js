const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    trainer: {
        type: String,
        required: true
    },
    date: {
        type: Date,   // ✅ CHANGE STRING → DATE
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Session", sessionSchema);