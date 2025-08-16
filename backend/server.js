require('dotenv').config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const predictRoutes = require("./routes/predictRoutes");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cookieParser()); 

const cors = require("cors");

const allowedOrigins = [
  "https://hate-speech-toxic-comment-detection-one.vercel.app",
  "https://hate-speech-toxic-comment-detection.vercel.app"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true // if you're using cookies / sessions
}));


app.use(express.json());


// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/predict", predictRoutes);

app.get("/", (req, res) => {
  res.send("✅ ToxiGuard AI Backend is running!");
});

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;

