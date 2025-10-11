const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// 1️⃣ Create a new order (must be first, static route)
router.post("/create", async (req, res) => {
  try {
    const orderData = req.body;
    const order = new Order(orderData);
    await order.save();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        orderStatus: order.orderStatus,
        estimatedDeliveryTime: order.estimatedDeliveryTime
      }
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create order"
    });
  }
});

// 2️⃣ Update payment info
router.put("/payment/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const updateData = req.body;

    const order = await Order.findByIdAndUpdate(orderId, { $set: updateData }, { new: true });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, message: "Payment updated", order });
  } catch (error) {
    console.error("Error updating payment:", error);
    res.status(500).json({ success: false, message: "Failed to update payment" });
  }
});

// 3️⃣ Update order status
router.put("/status/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus, cancellationReason } = req.body;

    const updateData = { orderStatus };
    if (cancellationReason) updateData.cancellationReason = cancellationReason;
    if (orderStatus === "delivered") updateData.deliveredAt = new Date();
    if (orderStatus === "cancelled") updateData.cancelledAt = new Date();

    const order = await Order.findByIdAndUpdate(orderId, updateData, { new: true });

    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    res.json({ success: true, message: "Order status updated", order });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ success: false, message: "Failed to update status" });
  }
});

// 4️⃣ Get orders by phone number
router.get("/phone/:phoneNumber", async (req, res) => {
  try {
    const { phoneNumber } = req.params;
    const orders = await Order.find({ phoneNumber }).sort({ createdAt: -1 }).limit(50);

    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    console.error("Error fetching orders by phone:", error);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
});

// 5️⃣ Get orders by user ID
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 }).limit(50);

    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    console.error("Error fetching orders by user:", error);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
});

// 6️⃣ Get all orders (for admin/testing)
router.get("/", async (req, res) => {
  try {
    const { status, limit = 100, page = 1 } = req.query;
    const query = {};
    if (status) query.orderStatus = status;

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Order.countDocuments(query);

    res.json({ success: true, count: orders.length, total, page: parseInt(page), orders });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
});

// 7️⃣ Cancel order
router.put("/cancel/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { cancellationReason } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    if (!["pending", "confirmed"].includes(order.orderStatus))
      return res.status(400).json({ success: false, message: "Order cannot be cancelled at this stage" });

    order.orderStatus = "cancelled";
    order.cancelledAt = new Date();
    order.cancellationReason = cancellationReason || "No reason provided";
    await order.save();

    res.json({ success: true, message: "Order cancelled", order });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({ success: false, message: "Failed to cancel order" });
  }
});

// 8️⃣ Get order by ID (must be last, dynamic route)
router.get("/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    res.json({ success: true, order });
  } catch (error) {
    console.error("Error getting order:", error);
    res.status(500).json({ success: false, message: "Failed to get order" });
  }
});

module.exports = router;
