const express = require("express");
const { registerAdmin,loginAdmin } = require("../controllers");
const router = express.Router();

// Route
router.post("/register", registerAdmin);
router.post("/login",loginAdmin)

module.exports = router;
