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
import SuppliersView from '../../Warehouse/views/SuppliersView';
import LossesView from '../../Warehouse/views/LossesView';
import EducationalStockControlView from '../../Warehouse/views/EducationalStockControlView';
import RequestsManagementTable from '../../Warehouse/components/RequestsManagementTable';
import { allEducationalRequests } from '../../../data/mockData';
import { DashboardIcon, ChartBarIcon, MailIcon, FileTextIcon, ArchiveIcon, TruckIcon, ExclamationTriangleIcon, UsersIcon } from '../../../components/shared/IconComponents';
import UserManagementView from './UserManagementView';
import CreateUserView from './CreateUserView';


interface EducationalAdminDashboardProps {
  userRole: UserRole;
  onLogout: () => void;
  isEducationalMode: boolean;
  onToggleEducationalMode: () => void;
}

const EducationalAdminDashboard: React.FC<EducationalAdminDashboardProps> = ({ userRole, onLogout, isEducationalMode, onToggleEducationalMode }) => {
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  
  // FIX: Add missing 'id' property to userData state to match UserData type.
  const [userData] = useState<UserData>({
    id: 'admin-edu-placeholder',
    name: 'Admin (Educacional)',
    avatar: '',
    email: 'admin@instituicao.edu',
    cpf: '000.000.000-00',
    linkedin: 'vyst-inc'
  });

  const handleNavigate = (view: string) => {
    setCurrentView(view);
  };

  const educationalNavItems: NavItemType[] = [
    { name: 'Painel de Controle', icon: DashboardIcon, view: 'dashboard' },
    { name: 'Análises e BI', icon: ChartBarIcon, view: 'analytics' },
    { name: 'Comunicação', icon: MailIcon, view: 'communication' },
    { name: 'Requisições', icon: FileTextIcon, view: 'requests' },
    { name: 'Controle de Estoque', icon: ArchiveIcon, view: 'stock' },
    { name: 'Fornecedores', icon: TruckIcon, view: 'suppliers' },
    { name: 'Perdas', icon: ExclamationTriangleIcon, view: 'losses' },
    { name: 'Gerenciar Usuários', icon: UsersIcon, view: 'users' },
    { name: 'Criar Usuários', icon: UsersIcon, view: 'create-user' },
  ];

  const renderContent = () => {
    switch (currentView) {
      case 'communication':
        return <CommunicationView userRole={userRole} />;
      case 'account':
        return <AccountView userRole={userRole} userData={userData} onUpdateUserData={() => {}} onNavigate={setCurrentView} />;
      case 'requests':
        return (
          <div className="h-full flex flex-col">
            <h2 className="text-2xl font-bold text-dark-text mb-4">Requisições (Educacional)</h2>
            <div className="flex-grow">
              {/* FIX: The 'requests' prop is not valid for this component because it fetches its own data. It has been removed. */}
              <RequestsManagementTable />
            </div>
          </div>
        );
      case 'analytics':
        return <AnalyticsView userRole="warehouse" onNavigate={setCurrentView} userData={userData} />;
      case 'custom-analytics':
        return <CustomAnalyticsView onBack={() => setCurrentView('analytics')} />;
      case 'stock':
        return <EducationalStockControlView userRole={userRole} />;
      case 'suppliers':
        return <SuppliersView userRole={userRole} />;
      case 'losses':
        return <LossesView userRole="warehouse" />;
      case 'users':
        return <UserManagementView manageableRoles={['warehouse']} />;
      case 'create-user':
        return <CreateUserView onUserCreated={() => {}} creatableRoles={['warehouse']} />;
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
