/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import { UserRole, UserData, Request } from '../../types';
import MyRequestsTable from './components/MyRequestsTable';
import { FileTextIcon } from '../../components/shared/IconComponents';
import RequestModal from '../../components/shared/RequestModal';
import AboutModal from '../../components/shared/AboutModal';
import CommunicationView from '../../components/communication/CommunicationView';
import ProfessorDashboard from './components/ProfessorDashboard';
import AccountView from '../Account/AccountView';
import AnalyticsView from '../Warehouse/views/AnalyticsView';
import StockControlView from '../Warehouse/views/StockControlView';
import LossesView from '../Warehouse/views/LossesView';
import CustomAnalyticsView from '../Admin/views/CustomAnalyticsView';
import PowerBIView from '../Warehouse/views/EducationalStockControlView';

interface ProfessorViewProps {
  userRole: UserRole;
  onLogout: () => void;
}

const ProfessorView: React.FC<ProfessorViewProps> = ({ userRole, onLogout }) => {
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [refreshKey, setRefreshKey] = useState(0);
  
  const [userData, setUserData] = useState<UserData>({
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', // Example UUID for API calls
    name: '',
    avatar: '',
    email: '',
    cpf: '',
    linkedin: ''
  });

  const handleUpdateUserData = (newUserData: Partial<UserData>) => {
    setUserData(prev => ({ ...prev, ...newUserData }));
  };

  const handleNewRequest = () => {
    setRefreshKey(prev => prev + 1);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'communication':
        return <CommunicationView userRole={userRole} userData={userData} />;
      case 'analytics':
        return <AnalyticsView userRole={userRole} userData={userData} onNavigate={setCurrentView} />;
      case 'custom-analytics':
        return <CustomAnalyticsView onBack={() => setCurrentView('analytics')} />;
      case 'stock':
        // FIX: Pass userData prop to satisfy StockControlViewProps requirements.
        return <StockControlView userRole={userRole} userData={userData} />;
      case 'losses':
        return <LossesView userRole={userRole} />;
      case 'powerbi':
        return <PowerBIView />;
      case 'requests':
        return (
            <>
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-dark-text">Histórico de Requisições</h2>
                    <button 
                        onClick={() => setIsRequestModalOpen(true)}
                        className="flex items-center bg-primary text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-primary/90 transition-all duration-300 transform hover:scale-105"
                    >
                        <FileTextIcon className="w-5 h-5 mr-2" />
                        Requisitar item
                    </button>
                </div>
                <MyRequestsTable userData={userData} refreshKey={refreshKey} />
            </>
        );
      case 'account':
        return <AccountView userRole={userRole} userData={userData} onUpdateUserData={handleUpdateUserData} onNavigate={setCurrentView} />;
      case 'dashboard':
      default:
        return <ProfessorDashboard onNewRequest={() => setIsRequestModalOpen(true)} userData={userData} refreshKey={refreshKey} />;
    }
  }

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
      <RequestModal 
        isOpen={isRequestModalOpen} 
        onClose={() => setIsRequestModalOpen(false)}
        userData={userData}
        onNewRequest={handleNewRequest}
      />
      <AboutModal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} />
    </>
  );
};

export default ProfessorView;