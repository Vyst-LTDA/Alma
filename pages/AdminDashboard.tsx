/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/

import React from 'react';
import WarehouseDashboard from './WarehouseDashboard';
import { UserRole } from '../types';

interface DashboardProps {
  userRole: UserRole;
  onLogout: () => void;
}

const AdminDashboard: React.FC<DashboardProps> = ({ userRole, onLogout }) => {
  // O painel do administrador terá mais funcionalidades no futuro.
  // Por enquanto, ele exibe o mesmo painel do almoxarifado.
  return <WarehouseDashboard userRole={userRole} onLogout={onLogout} />;
};

export default AdminDashboard;