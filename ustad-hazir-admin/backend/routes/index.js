const express = require("express");
const authRoutes = require("./authRoute");
const router = express.Router();

// Correct mounting
router.use("/auth", authRoutes);

module.exports = router;
