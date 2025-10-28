import React, { useState } from 'react';
import { UserRole } from '../types';
import Login from '../pages/Auth/Login';
import WarehouseDashboard from '../pages/Warehouse/WarehouseDashboard';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import ProfessorView from '../pages/Professor/ProfessorView';

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
  };

  const handleLogout = () => {
    setUserRole(null);
  };

  if (!userRole) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (userRole) {
      case 'professor':
        return <ProfessorView userRole={userRole} onLogout={handleLogout} />;
      case 'warehouse':
        return <WarehouseDashboard userRole={userRole} onLogout={handleLogout} />;
      case 'admin':
        return <AdminDashboard userRole={userRole} onLogout={handleLogout} />;
      default:
        return <Login onLogin={handleLogin} />;
    }
  };

  return (
    <div className="bg-light-bg min-h-screen flex font-sans">
      {renderContent()}
    </div>
  );
};

export default App;