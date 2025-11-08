const express = require("express");
const app = express();
const connectDB = require("./config/dbConfig");
const routes = require("./routes");
const cors = require("cors"); // ✅ import cors
// const router = express.Router();
require("dotenv").config();

const PORT = process.env.PORT;
// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({ origin: "*" })); // ⚡ allow all origins (for development)
app.use(express.json()); // parse JSON
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/admin", routes);
app.get("/hello", (req, res) => {
  res.send("Ustad Hazir Admin Backend is running 🚀");
});

// Server Start
app.listen(PORT, (req, res) => {
  console.log(`Server running on http://localhost:${PORT}`);
});
