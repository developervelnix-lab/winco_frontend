import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const authSecretKey = sessionStorage.getItem('auth_secret_key');
  
  return authSecretKey ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
