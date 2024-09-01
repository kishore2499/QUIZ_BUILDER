const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const authenticationRoutes = require("./routes/auth");
const quizManagementRoutes = require("./routes/quiz");

dotenv.config();

const app = express();

// Apply middleware
app.use(cors());
app.use(express.json());

// Register routes
app.use("/api/user", authenticationRoutes);
app.use("/api/quiz", quizManagementRoutes);

// Connect to MongoDB
mongoose.connect(process.env.DB_CONNECT, {
 
  
})
  .then(() => console.log("MongoDB connection established successfully"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

// Simple route to check server status
app.get("/", (req, res) => {
  res.send("The Quiz Builder API is live");
});

// Start server
const SERVER_PORT = process.env.PORT || 5000;
app.listen(SERVER_PORT, () => {
  console.log(`Server is up and running on port ${SERVER_PORT}`);
});





