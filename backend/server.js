// const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const connectDB = require("./config/db");

// const authRoutes = require("./routes/authRoutes");
// const predictRoutes = require("./routes/predictRoutes");

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors({
//   origin: 'http://localhost:5173', // your Vite frontend
//   credentials: true
// }));
// app.use(express.json());

// // Connect to MongoDB
// connectDB();

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/predict", predictRoutes);

// app.get("/", (req, res) => {
//   res.send("✅ ToxiGuard AI Backend is running!");
// });

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });
const express = require("express");
const cors = require("cors");
const connectDB = require("../config/db"); // adjust path if needed

const authRoutes = require("../routes/authRoutes");
const predictRoutes = require("../routes/predictRoutes");

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/predict", predictRoutes);

app.get("/", (req, res) => {
  res.send("✅ ToxiGuard AI Backend is running on Vercel!");
});

// ✅ Don't use app.listen on Vercel
module.exports = app;
