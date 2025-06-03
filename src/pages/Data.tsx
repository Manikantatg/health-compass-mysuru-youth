
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import DataDashboard from '../components/admin/DataDashboard';

const Data: React.FC = () => {
  const { userProfile } = useAuth();

  // Only allow admin users
  if (userProfile?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <DataDashboard />;
};

export default Data;
