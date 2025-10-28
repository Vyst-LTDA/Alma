/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
import React, { useState } from 'react';
import Sidebar from '../../../components/layout/Sidebar';
import Header from '../../../components/layout/Header';
import { UserRole, UserData } from '../../../types';
import AboutModal from '../../../components/shared/AboutModal';
import CommunicationView from '../../../components/communication/CommunicationView';
import AccountView from '../../Account/AccountView';
import RequestsView from '../../Warehouse/views/RequestsView';
import AnalyticsView from '../../Warehouse/views/AnalyticsView';
import WarehouseDashboardContent from '../../Warehouse/views/WarehouseDashboardContent';
import ServerManagementView from './ServerManagementView';
import CustomAnalyticsView from './CustomAnalyticsView';
import StockControlView from '../../Warehouse/views/StockControlView';
import UserManagementView from './UserManagementView';
import SuppliersView from '../../Warehouse/views/SuppliersView';
import LossesView from '../../Warehouse/views/LossesView';
import CreateUserView from './CreateUserView';

interface MainAdminDashboardProps {
  userRole: UserRole;
  onLogout: () => void;
  isEducationalMode: boolean;
  onToggleEducationalMode: () => void;
}

const MainAdminDashboard: React.FC<MainAdminDashboardProps> = ({ userRole, onLogout, isEducationalMode, onToggleEducationalMode }) => {
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  
  const [userData, setUserData] = useState<UserData>({
    name: '',
    avatar: '',
    email: 'admin@instituicao.edu',
    cpf: '000.000.000-00',
    linkedin: 'vyst-inc'
  });

  const handleNavigate = (view: string) => {
    setCurrentView(view);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'communication':
        return <CommunicationView userRole={userRole} />;
      case 'account':
        return <AccountView userRole={userRole} userData={userData} onUpdateUserData={() => {}} onNavigate={setCurrentView} />;
      case 'requests':
        return <RequestsView userRole={userRole} userData={userData} />;
      case 'analytics':
        return <AnalyticsView userRole={userRole} onNavigate={setCurrentView} userData={userData} />;
      case 'server-management':
        return <ServerManagementView />;
      case 'custom-analytics':
        return <CustomAnalyticsView onBack={() => setCurrentView('analytics')} />;
      case 'stock':
        return <StockControlView userRole={userRole} />;
      case 'users':
        return <UserManagementView manageableRoles={['professor']} />;
      case 'create-user':
        return <CreateUserView onUserCreated={() => {}} creatableRoles={['professor']} />;
      case 'suppliers':
        return <SuppliersView userRole={userRole} />;
      case 'losses':
        return <LossesView userRole={userRole} />;
      case 'dashboard':
      default:
        return <WarehouseDashboardContent userRole={userRole} onNavigate={handleNavigate} userData={userData} />;
    }
  };

  return (
    <>
      <Sidebar 
        userRole={userRole} 
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenAboutModal={() => setIsAboutModalOpen(true)} 
        isEducationalMode={isEducationalMode}
        onToggleEducationalMode={onToggleEducationalMode}
      />
      <div className="flex-1 flex flex-col">
        <Header 
            userRole={userRole}
            userData={userData} 
            onLogout={onLogout}
            onNavigate={setCurrentView}
            notifications={[]}
            unreadCount={0}
            onOpenNotifications={() => {}}
        />
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
      <AboutModal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} />
    </>
  );
};

export default MainAdminDashboard;