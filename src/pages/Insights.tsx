
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import InsightsDashboard from '../components/admin/InsightsDashboard';

const Insights: React.FC = () => {
  const { userProfile } = useAuth();

  // Only allow admin users
  if (userProfile?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <InsightsDashboard />;
};

export default Insights;
