/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
// FIX: Import UserData type
import { UserRole, UserData } from '../types';
import MyRequestsTable from '../components/professor/MyRequestsTable';
// FIX: Import path for IconComponents was incorrect.
import { FileTextIcon } from '../components/shared/IconComponents';
import RequestModal from '../components/professor/RequestModal';
import AboutModal from '../components/shared/AboutModal';
import CommunicationView from '../components/communication/CommunicationView';
import ProfileModal from '../components/profile/ProfileModal';
import SettingsModal from '../components/profile/SettingsModal';

interface ProfessorViewProps {
  userRole: UserRole;
  onLogout: () => void;
}

const ProfessorView: React.FC<ProfessorViewProps> = ({ userRole, onLogout }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  // Fix: Add state for profile and settings modals.
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  // FIX: Add state to manage the current view, which is required by the Sidebar.
  const [currentView, setCurrentView] = useState('dashboard');

  // FIX: Add mock userData to pass to the Header component.
  const [userData] = useState<UserData>({
    // FIX: Add id to userData to match UserData type.
    id: 'professor-placeholder-id',
    name: 'Professor',
    avatar: 'https://i.pravatar.cc/150?u=professor',
    email: 'professor@example.com',
    cpf: '444.555.666-77'
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
      case 'dashboard':
      default:
        return (
          <>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-dark-text">Minhas Requisições</h2>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center bg-primary text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-primary/90 transition-all duration-300 transform hover:scale-105"
                >
                    <FileTextIcon className="w-5 h-5 mr-2" />
                    Nova Requisição
                </button>
            </div>

            <MyRequestsTable />
          </>
        );
    }
  }

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
      <RequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <AboutModal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} />
      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} userRole={userRole} />
      <SettingsModal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} />
    </>
  );
};

export default ProfessorView;
