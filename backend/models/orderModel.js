const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  shippingInfo: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    note: { type: String },
  },
  items: [
    {
      name: String,
      size: String,
      quantity: Number,
      price: Number,
      image: String,
      _id: false,
    }
  ],
  status: {
    type: String,
    enum: ['Chờ xử lý', 'Đang giao', 'Hoàn thành', 'Đã huỷ'],
    default: 'Chờ xử lý'
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Order', orderSchema);
