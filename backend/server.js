require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);

const orderRoutes = require('./routes/orderRoutes');
app.use('/api/orders', orderRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const userAdminRoutes = require('./routes/userAdminRoutes');
app.use('/api/admin', require('./routes/userAdminRoutes'));




// Kết nối MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Kết nối MongoDB Atlas thành công!");
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server chạy ở cổng ${process.env.PORT}`);
    });
  })
  .catch(err => {
    console.error("❌ Kết nối MongoDB thất bại:", err.message);
  });

