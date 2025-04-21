const mongoose = require("mongoose");
const OrderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [{ product: mongoose.Schema.Types.ObjectId, quantity: Number }],
    totalPrice: { type: Number, required: true },
    status: { type: String, default: "Pending" }, // Pending, Paid, Shipped, etc.
    paymentIntentId: { type: String }, // Stripe Payment Intent ID
    paymentStatus: { type: String, default: "Pending" }, // Pending, Paid, Failed
    paymentMethod: { type: String }, // Card, Wallet, etc.
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
