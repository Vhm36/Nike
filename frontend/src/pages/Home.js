import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Box,
  Paper,
  Fade,
  Stack,
} from '@mui/material';
import { motion } from 'framer-motion';
import { ShoppingCart, Search, Straighten as StraightenIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';

const MotionCard = motion(Card);

// Thành phần chọn kích thước
const ProductSizeSelector = ({ sizes, onSizeSelect, selectedSize }) => {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="body2" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
        <StraightenIcon sx={{ mr: 1, fontSize: '1rem' }} />
        Chọn kích thước:
      </Typography>
      <Stack direction="row" spacing={1}>
        {sizes.map((size) => (
          <Button
            key={size}
            variant={selectedSize === size ? 'contained' : 'outlined'}
            size="small"
            onClick={() => onSizeSelect(size)}
            sx={{
              minWidth: '40px',
              fontSize: '0.75rem',
              padding: '4px 8px',
            }}
          >
            {size}
          </Button>
        ))}
      </Stack>
    </Box>
  );
};

export default function Home({ onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sizeFilter, setSizeFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [discountFilter, setDiscountFilter] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState({}); // State lưu kích thước được chọn cho từng sản phẩm

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(res => {
        setProducts(res.data);
        setFiltered(res.data);
      })
      .catch(err => {
        console.error("Lỗi API:", err);
        toast.error('Không thể tải danh sách sản phẩm');
      });
  }, []);

  useEffect(() => {
    let result = [...products];

    if (searchTerm.trim() !== '') {
      const keyword = searchTerm.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(keyword));
    }

    if (sizeFilter) {
      result = result.filter(p => p.size === sizeFilter);
    }

    if (priceFilter === 'lt500') {
      result = result.filter(p => p.price < 500000);
    } else if (priceFilter === '500to1m') {
      result = result.filter(p => p.price >= 500000 && p.price <= 1000000);
    } else if (priceFilter === 'gt1m') {
      result = result.filter(p => p.price > 1000000);
    }

    if (discountFilter) {
      result = result.filter(p => p.discount >= parseInt(discountFilter));
    }

    setFiltered(result);
  }, [searchTerm, sizeFilter, priceFilter, discountFilter, products]);

  const handleSizeSelect = (productId, size) => {
    setSelectedSizes(prev => ({
      ...prev,
      [productId]: size,
    }));
  };

  const handleAddToCart = (product) => {
    const selectedSize = selectedSizes[product._id];
    if (!selectedSize) {
      toast.error('Vui lòng chọn kích thước!');
      return;
    }
    onAddToCart({ ...product, selectedSize });
    toast.success('Đã thêm sản phẩm vào giỏ hàng!');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          🛍️ Danh sách Giày Nike
        </Typography>

        <Paper elevation={0} sx={{ p: 3, mb: 4, backgroundColor: 'background.paper' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text-primary' }} />,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Size</InputLabel>
                <Select
                  value={sizeFilter}
                  onChange={(e) => setSizeFilter(e.target.value)}
                  label="Size"
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  <MenuItem value="S">S</MenuItem>
                  <MenuItem value="M">M</MenuItem>
                  <MenuItem value="L">L</MenuItem>
                  <MenuItem value="XL">XL</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>💰 Khoảng giá</InputLabel>
                <Select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  label="💰 Khoảng giá"
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  <MenuItem value="lt500">Dưới 500k</MenuItem>
                  <MenuItem value="500to1m">500k – 1 triệu</MenuItem>
                  <MenuItem value="gt1m">Trên 1 triệu</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>🔖 Giảm giá từ</InputLabel>
                <Select
                  value={discountFilter}
                  onChange={(e) => setDiscountFilter(e.target.value)}
                  label="🔖 Giảm giá từ"
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  <MenuItem value={10}>Từ 10%</MenuItem>
                  <MenuItem value={20}>Từ 20%</MenuItem>
                  <MenuItem value={30}>Từ 30%</MenuItem>
                  <MenuItem value={50}>Từ 50%</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        <Grid container spacing={3}>
          {filtered.map((p, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={p._id}>
              <Fade in timeout={300} style={{ transitionDelay: `${index * 50}ms` }}>
                <MotionCard
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.2 }}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                  }}
                >
                  <CardMedia
                    component="img"
                    height="250"
                    image={p.image}
                    alt={p.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  {p.discount > 0 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        bgcolor: 'error.main',
                        color: 'white',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                      }}
                    >
                      -{p.discount}%
                    </Box>
                  )}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="h2" noWrap>
                      {p.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Giá:</strong> {p.price.toLocaleString()}đ
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Size khả dụng:</strong> {p.size}
                    </Typography>
                    <ProductSizeSelector
                      sizes={['S', 'M', 'L', 'XL']} // Có thể lấy từ API nếu sản phẩm có danh sách kích thước riêng
                      onSizeSelect={(size) => handleSizeSelect(p._id, size)}
                      selectedSize={selectedSizes[p._id]}
                    />
                  </CardContent>
                  <CardActions>
                    <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
                      <Button
                        fullWidth
                        variant="outlined"
                        size="medium"
                        startIcon={<ShoppingCart />}
                        onClick={() => handleAddToCart(p)}
                        sx={{ padding: '8px 16px' }}
                      >
                        Thêm
                      </Button>
                      <Button
                        fullWidth
                        variant="contained"
                        size="medium"
                        startIcon={<ShoppingCart />}
                        onClick={() => handleAddToCart(p)}
                        sx={{ padding: '8px 16px' }}
                      >
                        Mua
                      </Button>
                    </Stack>
                  </CardActions>
                </MotionCard>
              </Fade>
            </Grid>
          ))}
        </Grid>

        {filtered.length === 0 && (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h6" color="text.secondary">
              Không tìm thấy sản phẩm nào 😢
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
}