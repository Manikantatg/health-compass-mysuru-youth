
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import StudentDashboard from '../components/dashboard/StudentDashboard';
import AdminDashboard from '../components/admin/AdminDashboard';

const Dashboard: React.FC = () => {
  const { userProfile } = useAuth();

  if (userProfile?.role === 'admin') {
    return <AdminDashboard />;
  }

  return <StudentDashboard />;
};

export default Dashboard;
