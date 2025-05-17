import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Grid,
  Divider,
  CircularProgress,
  InputAdornment,
  useTheme,
} from '@mui/material';
import {
  Person as PersonIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Note as NoteIcon,
  ShoppingCart as ShoppingCartIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const MotionPaper = motion(Paper);

export default function Checkout({ cartItems, clearCart }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { token } = useSelector(state => state.auth);

  const [form, setForm] = useState({
    name: '',
    address: '',
    phone: '',
    note: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Kiểm tra đăng nhập khi component mount
  useEffect(() => {
    if (!token) {
      toast.error('Vui lòng đăng nhập để tiếp tục thanh toán!');
      navigate('/login');
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Kiểm tra xem tất cả sản phẩm trong giỏ có selectedSize chưa
    const hasMissingSize = cartItems.some(item => !item.selectedSize);
    if (hasMissingSize) {
      setError('Vui lòng chọn kích thước cho tất cả sản phẩm trong giỏ hàng!');
      setLoading(false);
      toast.error('Vui lòng chọn kích thước cho tất cả sản phẩm!');
      return;
    }

    try {
      // Chuẩn bị dữ liệu đơn hàng
      const orderItems = cartItems.map(item => ({
        _id: item._id,
        name: item.name,
        price: item.price,
        discount: item.discount,
        quantity: item.quantity,
        size: item.selectedSize // Gửi kích thước được chọn
      }));

      await axios.post('http://localhost:5000/api/orders', {
        shippingInfo: form,
        items: orderItems,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess(true);
      clearCart();
      toast.success('Đặt hàng thành công!');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Đặt hàng thất bại';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * (1 - item.discount / 100) * item.quantity,
    0
  );

  // Nếu không có token, hiển thị thông báo yêu cầu đăng nhập
  if (!token) {
    return (
      <Container maxWidth="md">
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="error" gutterBottom>
            Bạn cần đăng nhập để thanh toán
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/login')}
            sx={{ mt: 2 }}
          >
            Đi đến trang đăng nhập
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          📝 Thông tin giao hàng
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <MotionPaper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                backgroundColor: 'background.paper',
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}
              
              {success ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <CheckCircleIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                  <Typography variant="h5" color="success.main" gutterBottom>
                    🎉 Đặt hàng thành công!
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Cảm ơn bạn đã mua hàng. Chúng tôi sẽ xử lý đơn hàng của bạn sớm nhất có thể.
                  </Typography>
                </Box>
              ) : (
                <form onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="Họ tên"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    sx={{ mb: 3 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Địa chỉ"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    required
                    sx={{ mb: 3 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    sx={{ mb: 3 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Ghi chú"
                    name="note"
                    value={form.note}
                    onChange={handleChange}
                    multiline
                    rows={3}
                    sx={{ mb: 3 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <NoteIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    type="submit"
                    disabled={loading}
                    sx={{
                      py: 1.5,
                      position: 'relative',
                    }}
                  >
                    {loading ? (
                      <CircularProgress
                        size={24}
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          marginTop: '-12px',
                          marginLeft: '-12px',
                        }}
                      />
                    ) : (
                      'Đặt hàng'
                    )}
                  </Button>
                </form>
              )}
            </MotionPaper>
          </Grid>

          <Grid item xs={12} md={4}>
            <MotionPaper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                backgroundColor: 'background.paper',
                height: '100%',
              }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ShoppingCartIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Đơn hàng của bạn</Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              {cartItems.map((item) => (
                <Box key={item._id} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body1">
                      {item.name} x {item.quantity} (Size: {item.selectedSize || 'Chưa chọn'})
                    </Typography>
                    <Typography variant="body1">
                      {(item.price * (1 - item.discount / 100) * item.quantity).toLocaleString()}đ
                    </Typography>
                  </Box>
                  {item.discount > 0 && (
                    <Typography variant="caption" color="error">
                      Giảm {item.discount}%
                    </Typography>
                  )}
                </Box>
              ))}
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">Tạm tính:</Typography>
                <Typography variant="body1">{total.toLocaleString()}đ</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">Phí vận chuyển:</Typography>
                <Typography variant="body1">Miễn phí</Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Tổng cộng:</Typography>
                <Typography variant="h6" color="primary">
                  {total.toLocaleString()}đ
                </Typography>
              </Box>
            </MotionPaper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}