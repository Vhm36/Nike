const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Lấy tất cả sản phẩm
router.get('/', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Tạo sản phẩm mới (admin)
router.post('/', protect, adminOnly, async (req, res) => {
  const { name, price, size, discount, image } = req.body;

  try {
    const newProduct = new Product({ name, price, size, discount, image });
    const saved = await newProduct.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Lỗi thêm sản phẩm:', err);
    res.status(500).json({ message: 'Không thể thêm sản phẩm' });
  }
});

// Xoá sản phẩm theo ID
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });

    res.json({ message: 'Đã xoá sản phẩm' });
  } catch (err) {
    res.status(500).json({ message: 'Xoá sản phẩm thất bại' });
  }
});

// Cập nhật sản phẩm theo ID
router.put('/:id', protect, adminOnly, async (req, res) => {
  const { name, price, size, discount, image } = req.body;

  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });

    product.name = name;
    product.price = price;
    product.size = size;
    product.discount = discount;
    product.image = image;

    const updated = await product.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Cập nhật thất bại' });
  }
});




module.exports = router;
