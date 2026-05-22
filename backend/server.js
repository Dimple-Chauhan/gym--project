require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");

const app = express();

// ✅ MIDDLEWARES
app.use(cors());
app.use(express.json());

// ✅ STATIC FRONTEND
app.use(express.static(path.join(__dirname, "../frontend")));

// ✅ ROUTES
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const aiRoutes = require("./routes/aiRoutes");
app.use("/api/ai", aiRoutes);

const sessionRoutes = require("./routes/sessionRoutes");
app.use("/api/session", sessionRoutes);

// ✅ DATABASE CONNECTION
connectDB();

// ✅ TEST ROUTE
app.get("/{*path}", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// ✅ SERVER START
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

