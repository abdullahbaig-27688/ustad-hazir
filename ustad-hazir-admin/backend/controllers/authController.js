const { Admin } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body; // ⚠ Check body
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const adminExist = await Admin.findOne({ email });
    if (adminExist) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const admin = await Admin.create({ name, email, password });

    return res.status(201).json({
      id: admin._id,
      name: admin.name,
      email: admin.email,
      token: generateToken(admin._id),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Please fill all fields" });
  }
  const admin = await Admin.findOne({ email });
  if (!admin) {
    return res.status(400).json({ message: "Invalid Credentials" });
  }

  const isMatch = await bcrypt.compare(password,admin.password);
  if (!isMatch) {
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });
  }
  return res.json({
    _id: admin._id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    token: generateToken(admin._id),
  });
};
module.exports = { registerAdmin,loginAdmin };
