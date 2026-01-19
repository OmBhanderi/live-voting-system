import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPanel from '../components/admin/AdminPanel';
import Button from '../components/common/Button';

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="secondary" onClick={() => navigate('/')}>
        ← Back to Home
      </Button>

      {/* Admin Panel */}
      <AdminPanel />
    </div>
  );
};

export default AdminDashboard;