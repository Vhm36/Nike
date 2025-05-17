import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Box,
  Card,
  CardContent,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  ShoppingCart as ShoppingCartIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const MotionTableRow = motion(TableRow);

export default function Cart({ cartItems, onRemove, onUpdateQty }) {
  const theme = useTheme();
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * (1 - item.discount / 100) * item.quantity,
    0
  );

  const handleUpdateQuantity = (id, amount) => {
    onUpdateQty(id, amount);
    if (amount > 0) {
      toast.success('Đã tăng số lượng sản phẩm');
    } else {
      toast.info('Đã giảm số lượng sản phẩm');
    }
  };

  const handleRemove = (id) => {
    onRemove(id);
    toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <IconButton
            component={Link}
            to="/"
            sx={{ mr: 2 }}
            color="primary"
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            🛒 Giỏ hàng
          </Typography>
        </Box>

        {cartItems.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <ShoppingCartIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Giỏ hàng đang trống
              </Typography>
              <Button
                component={Link}
                to="/"
                variant="contained"
                startIcon={<ArrowBackIcon />}
                sx={{ mt: 2 }}
              >
                Tiếp tục mua sắm
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Ảnh</TableCell>
                    <TableCell>Tên sản phẩm</TableCell>
                    <TableCell>Size</TableCell>
                    <TableCell align="center">Số lượng</TableCell>
                    <TableCell align="right">Đơn giá</TableCell>
                    <TableCell align="right">Thành tiền</TableCell>
                    <TableCell align="center">Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <AnimatePresence>
                    {cartItems.map((item, idx) => (
                      <MotionTableRow
                        key={item._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                      >
                        <TableCell>
                          <Box
                            component="img"
                            src={item.image}
                            alt={item.name}
                            sx={{
                              width: 60,
                              height: 60,
                              objectFit: 'cover',
                              borderRadius: 1,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle1">{item.name}</Typography>
                          {item.discount > 0 && (
                            <Typography
                              variant="caption"
                              sx={{
                                color: 'error.main',
                                display: 'block',
                              }}
                            >
                              Giảm {item.discount}%
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>{item.size}</TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <IconButton
                              size="small"
                              onClick={() => handleUpdateQuantity(item._id, -1)}
                              sx={{ border: `1px solid ${theme.palette.divider}` }}
                            >
                              <RemoveIcon />
                            </IconButton>
                            <Typography sx={{ mx: 2, minWidth: 30, textAlign: 'center' }}>
                              {item.quantity}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => handleUpdateQuantity(item._id, 1)}
                              sx={{ border: `1px solid ${theme.palette.divider}` }}
                            >
                              <AddIcon />
                            </IconButton>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          {(item.price * (1 - item.discount / 100)).toLocaleString()}đ
                        </TableCell>
                        <TableCell align="right">
                          {(item.price * (1 - item.discount / 100) * item.quantity).toLocaleString()}đ
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            color="error"
                            onClick={() => handleRemove(item._id)}
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </MotionTableRow>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </TableContainer>

            <Paper
              elevation={0}
              sx={{
                mt: 4,
                p: 3,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Button
                component={Link}
                to="/"
                startIcon={<ArrowBackIcon />}
                variant="outlined"
              >
                Tiếp tục mua sắm
              </Button>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h6" color="text.secondary">
                  Tổng cộng:
                </Typography>
                <Typography variant="h4" color="primary" sx={{ mt: 1 }}>
                  {total.toLocaleString()}đ
                </Typography>
                <Button
                  component={Link}
                  to="/checkout"
                  variant="contained"
                  size="large"
                  sx={{ mt: 2 }}
                >
                  Thanh toán
                </Button>
              </Box>
            </Paper>
          </>
        )}
      </Box>
    </Container>
  );
}
