const express = require('express');
const router = express.Router();
const Order = require('../models/orderModel');
const { protect, adminOnly } = require('../middleware/authMiddleware');


// POST /api/orders
router.post('/', protect, adminOnly, async (req, res) => {
  const { shippingInfo, items } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'Giỏ hàng trống' });
  }

  try {
    const order = await Order.create({
      user: req.user._id,
      shippingInfo,
      items,
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Đặt hàng thất bại', error: err.message });
  }
});

// Lấy đơn hàng của người dùng hiện tại
router.get('/my-orders', protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('Lỗi lấy đơn hàng:', err);
    res.status(500).json({ message: 'Không lấy được đơn hàng' });
  }
});

// GET /api/orders/admin
router.get('/admin', protect, adminOnly, async (req, res) => {
  try {
    // Nếu muốn kiểm tra quyền admin, có thể thêm field isAdmin trong user
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Không lấy được đơn hàng admin' });
  }
});

// PUT /api/orders/:id/status
router.put('/:id/status', protect, async (req, res) => {
  const { status } = req.body;
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });

    order.status = status;
    await order.save();

    res.json({ message: 'Cập nhật thành công', order });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi cập nhật trạng thái đơn' });
  }
});


module.exports = router;
