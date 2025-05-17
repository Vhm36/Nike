import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container, Table, Button, Alert, Form, Row, Col, Spinner
} from 'react-bootstrap';
import { useSelector } from 'react-redux';

export default function AdminProducts() {
  const { token } = useSelector(state => state.auth);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', size: '', discount: '', image: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);


  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
    } catch (err) {
      setError('Không tải được sản phẩm');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post('http://localhost:5000/api/products', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setForm({ name: '', price: '', size: '', discount: '', image: '' });
      fetchProducts();
    } catch (err) {
      setError('Không thêm được sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xoá sản phẩm này?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts();
    } catch (err) {
      alert('Xoá thất bại');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
  
      if (editingId) {
        // Sửa sản phẩm
        await axios.put(`http://localhost:5000/api/products/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // Thêm sản phẩm mới
        await axios.post('http://localhost:5000/api/products', form, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
  
      setForm({ name: '', price: '', size: '', discount: '', image: '' });
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      setError('Không thể lưu sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      price: product.price,
      size: product.size,
      discount: product.discount,
      image: product.image
    });
    setEditingId(product._id);
  };
  
  

  return (
    <Container className="mt-5">
      <h2 className="mb-4">🛠️ Quản lý Sản phẩm</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleAdd}>
        <Row className="mb-4">
          <Col><Form.Control placeholder="Tên sản phẩm" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></Col>
          <Col><Form.Control type="number" placeholder="Giá" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required /></Col>
          <Col><Form.Control placeholder="Size" value={form.size} onChange={e => setForm({ ...form, size: e.target.value })} required /></Col>
          <Col><Form.Control type="number" placeholder="Giảm giá (%)" value={form.discount} onChange={e => setForm({ ...form, discount: e.target.value })} /></Col>
          <Col><Form.Control placeholder="Link ảnh" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} /></Col>
          <Col><Button type="submit" variant={editingId ? "warning" : "success"} disabled={loading}>
  {loading ? <Spinner size="sm" animation="border" /> : editingId ? ' Cập nhật' : ' Thêm'}
</Button>
</Col>
        </Row>
      </Form>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Tên</th>
            <th>Ảnh</th>
            <th>Giá</th>
            <th>Size</th>
            <th>Giảm</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td><img src={p.image} alt={p.name} style={{ width: '60px' }} /></td>
              <td>{p.price.toLocaleString()}đ</td>
              <td>{p.size}</td>
              <td>{p.discount}%</td>
              <td>
                <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEdit(p)}
                >
                Sửa
                </Button>
                <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(p._id)}
                >
                Xoá
                </Button>
                </td>

              
                </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
