import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container, Table, Spinner, Alert, Button, Form
} from 'react-bootstrap';
import { useSelector } from 'react-redux';

export default function AdminUsers() {
  const { token } = useSelector(state => state.auth);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      setError('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Xác nhận xoá user này?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
    } catch (err) {
      alert('❌ Xoá thất bại');
    }
  };

  const handleToggleRole = async (user) => {
    const updated = { ...user, isAdmin: !user.isAdmin };
    try {
      await axios.put(`http://localhost:5000/api/admin/users/${user._id}`, updated, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
    } catch (err) {
      alert('❌ Không thể cập nhật quyền');
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4">👥 Quản lý người dùng</h2>
      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}
      {!loading && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Quyền</th>
              <th>Ngày tạo</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <Form.Check
                    type="switch"
                    id={`admin-switch-${u._id}`}
                    label={u.isAdmin ? 'Admin' : 'User'}
                    checked={u.isAdmin}
                    onChange={() => handleToggleRole(u)}
                  />
                </td>
                <td>{new Date(u.createdAt).toLocaleString()}</td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(u._id)}
                  >
                    🗑 Xoá
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}
