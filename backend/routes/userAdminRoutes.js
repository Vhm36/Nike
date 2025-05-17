const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// [GET] /api/admin/users - Chỉ admin được xem
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password'); // không trả password
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// [DELETE] /api/admin/users/:id - Xoá user
router.delete('/users/:id', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy user' });
    res.json({ message: 'Đã xoá người dùng' });
  } catch (err) {
    res.status(500).json({ message: 'Xoá thất bại' });
  }
});

// PUT /api/admin/users/:id
router.put('/users/:id', protect, adminOnly, async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
  
      user.isAdmin = req.body.isAdmin; // cập nhật quyền
      await user.save();
  
      res.json({ message: 'Cập nhật thành công', user });
    } catch (err) {
      res.status(500).json({ message: 'Cập nhật thất bại' });
    }
  });
module.exports = router;
