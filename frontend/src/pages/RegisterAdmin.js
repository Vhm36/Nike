import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function RegisterAdmin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    adminPass: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post('http://localhost:5000/api/users/register-admin', form);
      setSuccess('Tạo admin thành công!');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Tạo tài khoản thất bại');
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <h3 className="mb-4 text-center">🔐 Tạo tài khoản Admin</h3>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Họ tên</Form.Label>
              <Form.Control value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mật khẩu</Form.Label>
              <Form.Control type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Mật khẩu Admin bí mật</Form.Label>
              <Form.Control type="text" value={form.adminPass} onChange={e => setForm({ ...form, adminPass: e.target.value })} required />
            </Form.Group>
            <Button type="submit" variant="danger" className="w-100">Tạo tài khoản Admin</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );

  
}
