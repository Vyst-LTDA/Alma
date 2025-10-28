/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
import React, { useState } from 'react';
import { UserRole } from '../../types';
import EducationalAdminDashboard from './views/EducationalAdminDashboard';
import MainAdminDashboard from './views/MainAdminDashboard';

interface DashboardProps {
  userRole: UserRole;
  onLogout: () => void;
}

const AdminDashboard: React.FC<DashboardProps> = ({ userRole, onLogout }) => {
  const [isEducationalMode, setIsEducationalMode] = useState(false);

  const handleToggleEducationalMode = () => {
    setIsEducationalMode(prev => !prev);
  };

  if (isEducationalMode) {
    return (
      <EducationalAdminDashboard
        userRole={userRole}
        onLogout={onLogout}
        isEducationalMode={isEducationalMode}
        onToggleEducationalMode={handleToggleEducationalMode}
      />
    );
  }

  return (
    <MainAdminDashboard 
      userRole={userRole}
      onLogout={onLogout}
      isEducationalMode={isEducationalMode}
      onToggleEducationalMode={handleToggleEducationalMode}
    />
  );
};

export default AdminDashboard;