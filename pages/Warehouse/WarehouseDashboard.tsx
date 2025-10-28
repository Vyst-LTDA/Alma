/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
import React, { useState, useMemo } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import { UserRole, UserData } from '../../types';
import AboutModal from '../../components/shared/AboutModal';
import { PlusIcon } from '../../components/shared/IconComponents';
import EducationalStockControlView from './views/EducationalStockControlView';
import WarehouseDashboardContent from './views/WarehouseDashboardContent';
import AnalyticsView from './views/AnalyticsView';
import SuppliersView from './views/SuppliersView';
import LossesView from './views/LossesView';
import CommunicationView from '../../components/communication/CommunicationView';
import AccountView from '../Account/AccountView';
import RequestsManagementTable from './components/RequestsManagementTable';
import EducationalAddStockEntryModal from './components/EducationalAddStockEntryModal';
import { allEducationalRequests } from '../../data/mockData';

interface DashboardProps {
  userRole: UserRole;
  onLogout: () => void;
}

const WarehouseDashboard: React.FC<DashboardProps> = ({ userRole, onLogout }) => {
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [userData, setUserData] = useState<UserData>({
    name: '',
    avatar: '',
    email: 'almoxarifado@instituicao.edu',
    cpf: '999.888.777-66',
    linkedin: 'almoxarifado-staff'
  });

  const handleUpdateUserData = (newUserData: Partial<UserData>) => {
    setUserData(prev => ({ ...prev, ...newUserData }));
  };

  const handleEntryAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  const educationalRequests = useMemo(() => {
    return [...allEducationalRequests]; 
  }, [refreshKey]);


  const renderContent = () => {
    switch (currentView) {
      case 'stock':
        return <EducationalStockControlView userRole={userRole} />;
      case 'analytics':
        return <AnalyticsView userRole={userRole} onNavigate={setCurrentView} userData={userData} />;
       case 'requests':
        return (
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-dark-text">Requisições do Almoxarifado</h2>
              <button
                onClick={() => setIsRequestModalOpen(true)}
                className="flex items-center bg-primary text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-primary/90 transition-all"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Registrar Entrada
              </button>
            </div>
            <div className="flex-grow mt-4">
              <RequestsManagementTable requests={educationalRequests} />
            </div>
          </div>
        );
      case 'suppliers':
        return <SuppliersView userRole={userRole} />;
      case 'losses':
        return <LossesView userRole={userRole} />;
      case 'communication':
        return <CommunicationView userRole={userRole} />;
      case 'account':
        return <AccountView userRole={userRole} userData={userData} onUpdateUserData={handleUpdateUserData} onNavigate={setCurrentView} />;
      case 'dashboard':
      default:
        return <WarehouseDashboardContent userRole={userRole} onNavigate={setCurrentView} userData={userData} />;
    }
  };

  return (
    <>
      <Sidebar 
        userRole={userRole} 
        currentView={currentView}
        onNavigate={setCurrentView}
        onOpenAboutModal={() => setIsAboutModalOpen(true)} 
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
      <EducationalAddStockEntryModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        userRole={userRole}
        onEntryAdded={() => {
          handleEntryAdded();
          setIsRequestModalOpen(false);
        }}
      />
    </>
  );
};

export default WarehouseDashboard;