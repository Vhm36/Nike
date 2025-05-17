import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from './redux/slices/authSlice';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, AppBar, Toolbar, Typography, Button, IconButton, Badge, Container, Box, useMediaQuery } from '@mui/material';
import { ShoppingCart, Person, Logout, Dashboard, Brightness4, Brightness7 } from '@mui/icons-material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import Home from './pages/Home';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import RegisterAdmin from './pages/RegisterAdmin';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
import AdminOrders from './pages/AdminOrders';
import AdminProducts from './pages/AdminProducts';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';

// Components
import PrivateRoute from './components/PrivateRoute';
import AdminLayout from './components/AdminLayout';
import AdminRoute from './components/AdminRoute';

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('themeMode');
    return savedMode || (prefersDarkMode ? 'dark' : 'light');
  });

  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: '#FF6B00',
        light: '#FF8533',
        dark: '#CC5500',
      },
      secondary: {
        main: '#1A1A1A',
        light: '#333333',
        dark: '#000000',
      },
      background: {
        default: mode === 'light' ? '#F5F5F5' : '#121212',
        paper: mode === 'light' ? '#FFFFFF' : '#1E1E1E',
      },
      text: {
        primary: mode === 'light' ? '#1A1A1A' : '#FFFFFF',
        secondary: mode === 'light' ? '#666666' : '#B0B0B0',
      },
      error: {
        main: '#FF4B4B',
      },
      success: {
        main: '#00C48C',
      },
      warning: {
        main: '#FFB800',
      },
      info: {
        main: '#00B8D9',
      },
    },
    typography: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
      },
      h2: {
        fontWeight: 600,
      },
      h3: {
        fontWeight: 600,
      },
      h4: {
        fontWeight: 600,
      },
      h5: {
        fontWeight: 500,
      },
      h6: {
        fontWeight: 500,
      },
      button: {
        textTransform: 'none',
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: '8px 16px',
          },
          contained: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: mode === 'light' 
              ? '0px 4px 20px rgba(0, 0, 0, 0.05)'
              : '0px 4px 20px rgba(0, 0, 0, 0.2)',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: mode === 'light'
              ? '0px 4px 20px rgba(0, 0, 0, 0.05)'
              : '0px 4px 20px rgba(0, 0, 0, 0.2)',
          },
        },
      },
    },
  });

  const handleLogout = () => {
    dispatch(logout());
  };

  const toggleColorMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
  };

  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const handleAddToCart = (product) => {
    const exist = cartItems.find(item => item._id === product._id);
    if (exist) {
      const updated = cartItems.map(item =>
        item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
      );
      setCartItems(updated);
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const handleRemoveFromCart = (productId) => {
    const updated = cartItems.filter(item => item._id !== productId);
    setCartItems(updated);
  };

  const handleUpdateQuantity = (productId, amount) => {
    const updated = cartItems.map(item => {
      if (item._id === productId) {
        const newQty = item.quantity + amount;
        return { ...item, quantity: newQty > 0 ? newQty : 1 };
      }
      return item;
    });
    setCartItems(updated);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppBar position="static" elevation={0}>
          <Container maxWidth="lg">
            <Toolbar disableGutters>
              <Typography
                variant="h6"
                component={Link}
                to="/"
                sx={{
                  flexGrow: 1,
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <img src="./image/Logo_NIKE.svg"  alt="logo" style={{ height: 30 , with: 10 }}/>
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton onClick={toggleColorMode} color="inherit">
                  {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                </IconButton>

                <IconButton
                  component={Link}
                  to="/cart"
                  color="inherit"
                  sx={{ position: 'relative' }}
                >
                  <Badge badgeContent={cartItems.reduce((sum, item) => sum + item.quantity, 0)} color="error">
                    <ShoppingCart />
                  </Badge>
                </IconButton>

                {user && (
                  <IconButton
                    component={Link}
                    to="/my-orders"
                    color="inherit"
                  >
                    <Dashboard />
                  </IconButton>
                )}

                {user ? (
                  <>
                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Person /> {user.name || "Tài khoản"}
                    </Typography>
                    <Button
                      variant="outlined"
                      color="inherit"
                      onClick={handleLogout}
                      startIcon={<Logout />}
                    >
                      Đăng xuất
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      component={Link}
                      to="/login"
                      color="inherit"
                      startIcon={<Person />}
                    >
                      Đăng nhập
                    </Button>
                    <Button
                      component={Link}
                      to="/register"
                      variant="contained"
                      color="secondary"
                    >
                      Đăng ký
                    </Button>
                  </>
                )}
              </Box>
            </Toolbar>
          </Container>
        </AppBar>

        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Routes>
            {/* Trang người dùng */}
            <Route path="/" element={<Home onAddToCart={handleAddToCart} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register-admin" element={<RegisterAdmin />} />
            <Route path="/checkout" element={
              <PrivateRoute>
                <Checkout cartItems={cartItems} clearCart={() => setCartItems([])} />
              </PrivateRoute>
            } />
            <Route path="/cart" element={
              <PrivateRoute>
                <Cart
                  cartItems={cartItems}
                  onRemove={handleRemoveFromCart}
                  onUpdateQty={handleUpdateQuantity}
                />
              </PrivateRoute>
            } />
            <Route path="/my-orders" element={
              <PrivateRoute>
                <MyOrders />
              </PrivateRoute>
            } />

            {/* ✅ Route admin bọc trong AdminLayout + PrivateRoute */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="users" element={<AdminUsers />} />
            </Route>
          </Routes>
        </Container>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </Router>
    </ThemeProvider>
  );
}

export default App;
