const express = require("express");
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getProducts); // Get all products
router.get("/:id", getProductById); // Get product by ID
router.post("/", protect, admin, createProduct); // Create a product (Admin-only)
router.put("/:id", protect, admin, updateProduct); // Update a product (Admin-only)
router.delete("/:id", protect, admin, deleteProduct); // Delete a product (Admin-only)

module.exports = router;
