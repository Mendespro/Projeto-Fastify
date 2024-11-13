import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const auth = localStorage.getItem('token'); // Verifica se o token existe
  return auth ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;