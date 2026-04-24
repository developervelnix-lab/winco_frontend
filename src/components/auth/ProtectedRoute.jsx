import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSite } from '../../context/SiteContext';

const ProtectedRoute = ({ children }) => {
  const { accountInfo, setShowLogin, loading } = useSite();
  const location = useLocation();
  
  // Use same logic as Navbar: require both memory state and localStorage token
  const authSecretKey = localStorage.getItem("auth_secret_key");
  const isLoggedIn = !!(accountInfo?.account_id && authSecretKey);

  useEffect(() => {
    // If not logged in and not currently loading initial site data
    if (!loading && !isLoggedIn) {
      setShowLogin(true);
    }
  }, [isLoggedIn, setShowLogin, loading]);

  if (loading) {
    return null; // Or a loader component
  }

  if (!isLoggedIn) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  
  return children;
};

export default ProtectedRoute;
