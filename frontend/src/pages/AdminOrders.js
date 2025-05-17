import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container, Table, Spinner, Alert, Form
} from 'react-bootstrap';
import { useSelector } from 'react-redux';

export default function AdminOrders() {
  const { token } = useSelector(state => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/orders/admin', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setOrders(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, {
        status: newStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchOrders(); // refresh lại danh sách
    } catch (err) {
      alert('Cập nhật trạng thái thất bại!');
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4">📋 Quản lý đơn hàng</h2>
      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}
      {!loading && orders.length === 0 && <Alert variant="info">Chưa có đơn hàng nào</Alert>}
      {!loading && orders.length > 0 && (
        <Table bordered hover responsive>
          <thead>
            <tr>
              <th>Người đặt</th>
              <th>Ngày đặt</th>
              <th>Sản phẩm</th>
              <th>Trạng thái</th>
              <th>Tổng tiền</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>{order.user?.name || 'Ẩn'}</td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td>
                  {order.items.map(item => (
                    <div key={item.name}>
                      {item.name} ({item.size}) x {item.quantity}
                    </div>
                  ))}
                </td>
                <td>
                  <Form.Select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  >
                    <option>Chờ xử lý</option>
                    <option>Đang giao</option>
                    <option>Hoàn thành</option>
                    <option>Đã huỷ</option>
                  </Form.Select>
                </td>
                <td>
                  {order.items.reduce((sum, item) => sum + item.quantity * item.price, 0).toLocaleString()}đ
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}
