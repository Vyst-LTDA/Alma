/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import StatCard from '../components/dashboard/StatCard';
import RequestStatusChart from '../components/dashboard/EventStatusChart';
import RequestSummaryChart from '../components/dashboard/CommandThroughputChart';
import InventoryTurnoverChart from '../components/dashboard/LatencyChart';
import RecentRequestsTable from '../components/dashboard/RecentCommandsTable';
// FIX: Import UserData type
import { UserRole, UserData } from '../types';
// FIX: Import path for IconComponents was incorrect.
import { CubeIcon, BoltIcon, DocumentDuplicateIcon, CircleStackIcon } from '../components/shared/IconComponents';
import AboutModal from '../components/shared/AboutModal';
import CommunicationView from '../components/communication/CommunicationView';
import ProfileModal from '../components/profile/ProfileModal';
import SettingsModal from '../components/profile/SettingsModal';

interface DashboardProps {
  userRole: UserRole;
  onLogout: () => void;
}

const WarehouseDashboard: React.FC<DashboardProps> = ({ userRole, onLogout }) => {
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  // Fix: Add state for profile and settings modals.
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  // FIX: Add state to manage the current view, which is required by the Sidebar.
  const [currentView, setCurrentView] = useState('dashboard');

  // FIX: Add mock userData to pass to the Header component.
  const [userData] = useState<UserData>({
    // FIX: Add id to userData to match UserData type.
    id: 'warehouse-dashboard-placeholder-id',
    name: 'Almoxarifado',
    avatar: 'https://i.pravatar.cc/150?u=warehouse',
    email: 'warehouse@example.com',
    cpf: '111.222.333-44'
  });

  // FIX: Create a navigation handler to bridge new components (Header, Sidebar) with old modal-based logic.
  const handleNavigate = (view: string) => {
    if (view === 'account') {
      setIsProfileModalOpen(true);
    } else {
      setCurrentView(view);
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'communication':
        return <CommunicationView userRole={userRole} />;
      // Add cases for 'requests', 'stock', 'suppliers' here in the future
      case 'dashboard':
      default:
        return (
          <>
            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard 
                title="Requisições Pendentes" 
                value="72" 
                change="+12" 
                changeType="increase" 
                icon={<DocumentDuplicateIcon className="w-8 h-8 text-primary" />} 
              />
              <StatCard 
                title="Itens em Estoque Baixo" 
                value="15" 
                change="+3" 
                changeType="increase" 
                icon={<BoltIcon className="w-8 h-8 text-secondary" />} 
              />
              <StatCard 
                title="Total de Itens" 
                value="1,240" 
                change="-50" 
                changeType="decrease" 
                icon={<CubeIcon className="w-8 h-8 text-green-500" />} 
              />
              <StatCard 
                title="Empréstimos Ativos" 
                value="89" 
                change="No changes" 
                changeType="neutral" 
                icon={<CircleStackIcon className="w-8 h-8 text-orange-500" />} 
              />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <div className="lg:col-span-1">
                <RequestStatusChart />
              </div>
              <div className="lg:col-span-2">
                <RequestSummaryChart />
              </div>
            </div>

            {/* Full Width Chart and Table */}
            <div className="grid grid-cols-1 gap-8">
              <InventoryTurnoverChart />
              <RecentRequestsTable />
            </div>
          </>
        );
    }
  };


  return (
    <>
      {/* FIX: Pass currentView and onNavigate props to Sidebar to resolve the type error. */}
      <Sidebar 
        userRole={userRole} 
        currentView={currentView} 
        onNavigate={handleNavigate} 
        onOpenAboutModal={() => setIsAboutModalOpen(true)} />
      <div className="flex-1 flex flex-col">
        {/* Fix: Pass missing props to Header to resolve the type error. */}
        <Header 
            userRole={userRole} 
            userData={userData}
            onLogout={onLogout}
            onNavigate={handleNavigate}
            notifications={[]}
            unreadCount={0}
            onOpenNotifications={() => {}}
        />
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
      <AboutModal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} />
      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} userRole={userRole} />
      <SettingsModal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} />
    </>
  );
};

export default WarehouseDashboard;
