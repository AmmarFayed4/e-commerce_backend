const Order = require("../models/Order");
const Cart = require("../models/Cart");
const stripe = require("stripe")(process.env.STRIPE_SECRET); // Import Stripe with your secret key

const createOrder = async (req, res) => {
  try {
    // Fetch the user's cart
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    // Extract shipping address from request body
    const { shippingAddress } = req.body;
    if (!shippingAddress) {
      return res.status(400).json({ message: "Shipping address is required" });
    }

    // Calculate total price
    const totalPrice = cart.items.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);

    // Create a Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalPrice * 100),
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    // Create the order in the database
    const order = await Order.create({
      user: req.user._id,
      items: cart.items,
      totalPrice,
      status: "Pending",
      paymentIntentId: paymentIntent.id,
      paymentStatus: "Pending",
      shippingAddress, // Save the shipping address
    });

    // Clear the user's cart
    cart.items = [];
    await cart.save();

    res.json({ order, clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all user orders
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate(
      "items.product"
    );
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// cancel order
const cancelOrder = async (req, res) => {
  const userId = req.user._id;
  const orderId = req.params.id;
  console.log(userId);
  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Only allow the order owner to cancel the order
    if (order.user.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to cancel this order" });
    }

    // Update order status to 'Cancelled'
    if (order.status === "Delivered") {
      return res
        .status(400)
        .json({ message: "Delivered orders cannot be canceled" });
    }
    order.status = "Cancelled";
    await order.save();

    res.json({ message: "Order canceled successfully", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const confirmPayment = async (req, res) => {
  const { paymentIntentId, orderId } = req.body;

  try {
    // Verify the payment intent using Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === "succeeded") {
      // Update the order to reflect payment success
      const order = await Order.findById(orderId);
      if (!order) return res.status(404).json({ message: "Order not found" });

      order.paymentStatus = "Paid";
      order.status = "Processing"; // Move to the next status
      await order.save();

      res.json({ message: "Payment confirmed", order });
    } else {
      res.status(400).json({ message: "Payment not completed" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const validStatuses = ["Pending", "Processing", "Shipped", "Delivered"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid order status value" });
  }
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.status === "Cancelled") {
      return res.status(400).json({
        message: "This order has been canceled and cannot be modified further.",
      });
    }

    order.status = status;
    await order.save();

    res.json(order);
    console.log(
      `Admin ${req.user._id} updated order ${req.params.id} to status ${status}`
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  cancelOrder,
  updateOrderStatus,
  confirmPayment,
};
