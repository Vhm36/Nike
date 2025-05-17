import React from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { Link, Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <Container fluid>
      <Row>
        <Col md={2} className="bg-dark text-white min-vh-100 p-3">
          <h4 className="text-center mb-4">Admin</h4>
          <Nav className="flex-column">
            <Nav.Link as={Link} to="/admin/dashboard" className="text-white">📊 Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/admin/orders" className="text-white">🧾 Quản lý đơn hàng</Nav.Link>
            <Nav.Link as={Link} to="/admin/products" className="text-white">📦 Quản lý sản phẩm</Nav.Link>
            <Nav.Link as={Link} to="/admin/users" className="text-white">👥 Quản lý người dùng</Nav.Link>
          </Nav>
        </Col>
        <Col md={10} className="p-4">
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
}
