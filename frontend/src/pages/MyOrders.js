import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
  Chip,
  Button,
} from '@mui/material';
import {
  ShoppingBag as ShoppingBagIcon,
  LocalShipping as LocalShippingIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const MotionTableRow = motion(TableRow);

export default function MyOrders() {
  const { token } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Kiểm tra đăng nhập khi component mount
  useEffect(() => {
    if (!token) {
      toast.error('Vui lòng đăng nhập để xem đơn hàng của bạn!');
      navigate('/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return; // Không gọi API nếu chưa đăng nhập
      try {
        const res = await axios.get('http://localhost:5000/api/orders/my-orders', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(res.data);
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Lỗi tải đơn hàng';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'shipped':
        return 'primary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const cancelOrder = async (orderId) => {
    if (window.confirm('Bạn có chắc muốn hủy đơn hàng này không?')) {
      try {
        await axios.delete(`http://localhost:5000/api/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(prevOrders => prevOrders.filter(order => order._id !== orderId));
        toast.success('Đã hủy đơn hàng thành công');
      } catch (err) {
        toast.error('Không thể hủy đơn hàng này');
      }
    }
  };

  // Nếu không có token, hiển thị thông báo yêu cầu đăng nhập
  if (!token) {
    return (
      <Container maxWidth="md">
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="error" gutterBottom>
            Bạn cần đăng nhập để xem đơn hàng
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
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <ShoppingBagIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
          <Typography variant="h4" component="h1">
            📦 Đơn hàng của tôi
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : orders.length === 0 ? (
          <Paper
            elevation={0}
            sx={{ p: 4, textAlign: 'center', borderRadius: 2, backgroundColor: 'background.paper' }}
          >
            <InventoryIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Bạn chưa có đơn hàng nào
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Hãy mua sắm và tạo đơn hàng đầu tiên của bạn!
            </Typography>
          </Paper>
        ) : (
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Mã đơn hàng</TableCell>
                  <TableCell>Ngày đặt</TableCell>
                  <TableCell>Sản phẩm</TableCell>
                  <TableCell>Số lượng</TableCell>
                  <TableCell>Tổng tiền</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <AnimatePresence>
                  {orders.map((order, index) => (
                    <MotionTableRow
                      key={order._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <TableCell>{order._id.slice(-6)}</TableCell>
                      <TableCell>{formatDate(order.createdAt)}</TableCell>
                      <TableCell>
                        {order.items.map(item => (
                          <div key={item._id}>
                            {item.name} (Size: {item.size || 'Chưa chọn'})
                          </div>
                        ))}
                      </TableCell>
                      <TableCell>{order.items.reduce((sum, item) => sum + item.quantity, 0)}</TableCell>
                      <TableCell>
                        {order.items
                          .reduce((sum, item) => sum + item.quantity * item.price * (1 - item.discount / 100), 0)
                          .toLocaleString()}đ
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={order.status || 'Đang xử lý'}
                          color={getStatusColor(order.status)}
                          size="small"
                          icon={<LocalShippingIcon />}
                        />
                      </TableCell>
                      <TableCell>
                        {['pending', 'processing'].includes(order.status) && (
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => cancelOrder(order._id)}
                          >
                            Hủy
                          </Button>
                        )}
                      </TableCell>
                    </MotionTableRow>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Container>
  );
}