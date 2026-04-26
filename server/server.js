require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./config/db");

// Route imports
const authRoutes = require("./routes/auth.routes");
const passengerRoutes = require("./routes/passenger.routes");
const trainRoutes = require("./routes/train.routes");
const reservationRoutes = require("./routes/reservation.routes");
const chatRoutes = require("./routes/chat.routes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow all origins for easy deployment
      callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Welcome route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Railway Reservation System API" });
});

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/passengers", passengerRoutes);
app.use("/api/trains", trainRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/chat", chatRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong on the server!",
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found.",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
