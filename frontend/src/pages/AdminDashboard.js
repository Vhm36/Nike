import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  useTheme,
} from '@mui/material';
import {
  ShoppingCart as ShoppingCartIcon,
  Inventory as InventoryIcon,
  AttachMoney as AttachMoneyIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  LocalShipping as LocalShippingIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const MotionPaper = motion(Paper);
const MotionCard = motion(Card);

export default function AdminDashboard() {
  const theme = useTheme();
  const { token } = useSelector(state => state.auth);
  const [stats, setStats] = useState({ orders: [], products: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [ordersRes, productsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/orders/admin', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/products')
      ]);
      setStats({
        orders: ordersRes.data,
        products: productsRes.data
      });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Không thể tải dữ liệu dashboard';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalRevenue = stats.orders.reduce((sum, order) => {
    return sum + order.items.reduce((s, item) => s + item.price * item.quantity, 0);
  }, 0);

  const pendingOrders = stats.orders.filter(order => order.status === 'pending').length;
  const processingOrders = stats.orders.filter(order => order.status === 'processing').length;
  const shippedOrders = stats.orders.filter(order => order.status === 'shipped').length;

  const StatCard = ({ title, value, icon, color, onClick }) => (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick ? {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[4],
        } : {},
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {React.cloneElement(icon, { sx: { fontSize: 40, color: `${color}.main`, mr: 2 } })}
          <Typography variant="h6" color="text.secondary">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="div" sx={{ mb: 2 }}>
          {value}
        </Typography>
        {onClick && (
          <Button
            variant="outlined"
            size="small"
            sx={{ mt: 2 }}
            startIcon={<TrendingUpIcon />}
          >
            Xem chi tiết
          </Button>
        )}
      </CardContent>
    </MotionCard>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <TrendingUpIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
        <Typography variant="h4" component="h1">
          📊 Admin Dashboard
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
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <StatCard
              title="Tổng đơn hàng"
              value={stats.orders.length}
              icon={<ShoppingCartIcon />}
              color="primary"
              onClick={() => navigate('/admin/orders')}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard
              title="Tổng sản phẩm"
              value={stats.products.length}
              icon={<InventoryIcon />}
              color="success"
              onClick={() => navigate('/admin/products')}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard
              title="Doanh thu"
              value={`${totalRevenue.toLocaleString()}đ`}
              icon={<AttachMoneyIcon />}
              color="warning"
            />
          </Grid>

          <Grid item xs={12}>
            <MotionPaper
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              sx={{ p: 3, mt: 3 }}
            >
              <Typography variant="h6" gutterBottom>
                Trạng thái đơn hàng
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <LocalShippingIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                    <Typography variant="h4">{pendingOrders}</Typography>
                    <Typography color="text.secondary">Đơn hàng mới</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <PeopleIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h4">{processingOrders}</Typography>
                    <Typography color="text.secondary">Đang xử lý</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <ShoppingCartIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                    <Typography variant="h4">{shippedOrders}</Typography>
                    <Typography color="text.secondary">Đã giao</Typography>
                  </Box>
                </Grid>
              </Grid>
            </MotionPaper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}
