const express = require("express");
const router = express.Router();
const Session = require("../models/Session");
const authMiddleware = require("../middleware/authMiddleware");


// ✅ BOOK SESSION
router.post("/book", authMiddleware, async (req, res) => {

    try {
        const userId = req.userId; // ✅ from JWT
        const { trainer, date } = req.body;

        const selectedDate = new Date(date);
        const today = new Date();

        // ✅ 3 MONTH LIMIT
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 3);

        if (selectedDate > maxDate) {
            return res.json({
                success: false,
                message: "Booking allowed only within 3 months"
            });
        }

        // ✅ AUTO DELETE OLD SESSIONS
        await Session.deleteMany({
            userId,
            date: { $lt: today }
        });

        // ✅ GET USER SESSIONS
        const sessions = await Session.find({ userId });

        // ❌ MAX 4
        if (sessions.length >= 4) {
            return res.json({
                success: false,
                message: "Max 4 sessions allowed"
            });
        }

        // ❌ SAME TRAINER
        const exists = sessions.find(s => s.trainer === trainer);

        if (exists) {
            return res.json({
                success: false,
                message: "Trainer already booked"
            });
        }

        // ✅ SAVE
        const newSession = new Session({
            userId,
            trainer,
            date: selectedDate
        });

        await newSession.save();

        res.json({ success: true });

    } catch (err) {
        res.json({ success: false, message: "Server error" });
    }

});


// ✅ GET USER SESSIONS
router.get("/my", authMiddleware, async (req, res) => {

    try {
        const userId = req.userId;

        // ✅ AUTO DELETE OLD
        await Session.deleteMany({
            userId,
            date: { $lt: new Date() }
        });

        const sessions = await Session.find({ userId });

        res.json({ success: true, sessions });

    } catch (err) {
        res.json({ success: false });
    }

});


// ✅ DELETE SESSION
router.delete("/cancel/:id", authMiddleware, async (req, res) => {

    try {
        const userId = req.userId;
        const sessionId = req.params.id;

        // ensure user deletes only their own session
        const session = await Session.findOne({
            _id: sessionId,
            userId
        });

        if(!session){
            return res.json({
                success:false,
                message:"Session not found"
            });
        }

        await Session.findByIdAndDelete(sessionId);

        res.json({ success:true });

    } catch(err){
        res.json({ success:false, message:"Server error" });
    }

});

module.exports = router;