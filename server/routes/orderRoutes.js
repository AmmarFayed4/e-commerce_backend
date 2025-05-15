const express = require("express");
const {
  createOrder,
  getLastOrder,
  getUserOrders,
  cancelOrder,
  updateOrderStatus,
  confirmPayment,
} = require("../controllers/orderController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createOrder); // Create an order
router.get("/", protect, getUserOrders); // Get all user orders
router.put("/cancel/:id", protect, cancelOrder); // Cancel an order (User-only)
router.post("/confirm", protect, confirmPayment);
router.put("/:id", protect, admin, updateOrderStatus); // Update order status

module.exports = router;
