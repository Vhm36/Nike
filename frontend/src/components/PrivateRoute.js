import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }) {
  const { token } = useSelector(state => state.auth);

  return token ? children : <Navigate to="/login" replace />;
}
