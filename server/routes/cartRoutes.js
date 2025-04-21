const express = require("express");
const {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add", protect, addToCart); // Add item to cart
router.get("/", protect, getCart); // Get user cart
router.put("/update/:itemId", protect, updateCartItem); // Update item quantity
router.delete("/remove/:itemId", protect, removeCartItem); // Remove item from cart
router.delete("/clear", protect, clearCart); // Clear entire cart

module.exports = router;
