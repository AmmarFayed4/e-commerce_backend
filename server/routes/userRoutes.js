const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController.js");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// User Authentication & Profile Routes
router.post("/register", registerUser); // Register new user
router.post("/login", loginUser); // Login user & get JWT token
router.get("/profile", protect, getUserProfile); // Get user profile (Protected)
router.put("/update", protect, updateUserProfile); // Update user profile (Protected)

module.exports = router;
