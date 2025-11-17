/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
import React, { useState } from 'react';
import Sidebar from '../../../components/layout/Sidebar';
import Header from '../../../components/layout/Header';
import { UserRole, UserData, NavItemType } from '../../../types';
import AboutModal from '../../../components/shared/AboutModal';
import CommunicationView from '../../../components/communication/CommunicationView';
import AccountView from '../../Account/AccountView';
import AnalyticsView from '../../Warehouse/views/AnalyticsView';
import WarehouseDashboardContent from '../../Warehouse/views/WarehouseDashboardContent';
import CustomAnalyticsView from './CustomAnalyticsView';
import LossesView from '../../Warehouse/views/LossesView';
import StockControlView from '../../Warehouse/views/StockControlView';
import RequestsManagementTable from '../../Warehouse/components/RequestsManagementTable';
import PowerBIView from '../../Warehouse/views/EducationalStockControlView';
import { DashboardIcon, ChartBarIcon, MailIcon, FileTextIcon, ArchiveIcon, ExclamationTriangleIcon, UsersIcon, ChartBarSquareIcon } from '../../../components/shared/IconComponents';
import UserManagementView from './UserManagementView';


interface EducationalAdminDashboardProps {
  userRole: UserRole;
  onLogout: () => void;
  isEducationalMode: boolean;
  onToggleEducationalMode: () => void;
}

const EducationalAdminDashboard: React.FC<EducationalAdminDashboardProps> = ({ userRole, onLogout, isEducationalMode, onToggleEducationalMode }) => {
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  
  const [userData] = useState<UserData>({
    id: 'admin-edu-placeholder',
    name: '',
    avatar: '',
    email: '',
    cpf: '',
    linkedin: ''
  });

  const handleNavigate = (view: string) => {
    setCurrentView(view);
  };

  const earlyAccessEnabled = typeof window !== 'undefined' && localStorage.getItem('earlyAccess') === 'true';

  const powerBiNavItem: NavItemType = { 
      name: 'Power BI', 
      icon: ChartBarSquareIcon, 
      view: 'powerbi' 
  };

  const educationalNavItems: NavItemType[] = [
    { name: 'Painel de Controle', icon: DashboardIcon, view: 'dashboard' },
    { name: 'Análises e BI', icon: ChartBarIcon, view: 'analytics' },
    { name: 'Comunicação', icon: MailIcon, view: 'communication' },
    { name: 'Requisições', icon: FileTextIcon, view: 'requests' },
    { name: 'Controle de Estoque', icon: ArchiveIcon, view: 'stock' },
    { name: 'Perdas', icon: ExclamationTriangleIcon, view: 'losses' },
    { name: 'Gerenciar Usuários', icon: UsersIcon, view: 'users' },
  ];

  if(earlyAccessEnabled) educationalNavItems.splice(2, 0, powerBiNavItem);

  const renderContent = () => {
    switch (currentView) {
      case 'communication':
        return <CommunicationView userRole={userRole} userData={userData} />;
      case 'account':
        return <AccountView userRole={userRole} userData={userData} onUpdateUserData={() => {}} onNavigate={setCurrentView} />;
      case 'requests':
        return (
          <div className="h-full flex flex-col">
            <h2 className="text-2xl font-bold text-dark-text mb-4">Requisições (Educacional)</h2>
            <div className="flex-grow">
              <RequestsManagementTable />
            </div>
          </div>
        );
      case 'analytics':
        return <AnalyticsView userRole="warehouse" onNavigate={setCurrentView} userData={userData} />;
      case 'custom-analytics':
        return <CustomAnalyticsView onBack={() => setCurrentView('analytics')} />;
      case 'stock':
        return <StockControlView userRole={userRole} userData={userData} />;
      case 'losses':
        return <LossesView userRole="warehouse" />;
      case 'users':
        return <UserManagementView manageableRoles={['warehouse']} />;
      case 'powerbi':
        return <PowerBIView />;
      case 'dashboard':
      default:
        return <WarehouseDashboardContent userRole="warehouse" onNavigate={setCurrentView} userData={userData} />;
    }
  };

  return (
    <>
      <Sidebar 
        userRole={userRole} 
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenAboutModal={() => setIsAboutModalOpen(true)}
        navItems={educationalNavItems}
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

export default EducationalAdminDashboard;