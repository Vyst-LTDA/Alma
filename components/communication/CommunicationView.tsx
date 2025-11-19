/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
import React, { useState } from 'react';
import { UserRole, UserData } from '../../types';
import Announcements from './Announcements';
import Chat from './Chat';

interface CommunicationViewProps {
    userRole: UserRole;
    userData: UserData;
}

type ActiveTab = 'announcements' | 'chat';

const CommunicationView: React.FC<CommunicationViewProps> = ({ userRole, userData }) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('announcements');
    const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);

    const renderTabContent = () => {
        switch (activeTab) {
            case 'announcements':
                return <Announcements userRole={userRole} />;
            case 'chat':
                return <Chat userRole={userRole} userData={userData} isCreateGroupModalOpen={isCreateGroupModalOpen} setCreateGroupModalOpen={setIsCreateGroupModalOpen} />;
            default:
                return null;
        }
    };

    const TabButton: React.FC<{tabName: ActiveTab, label: string}> = ({ tabName, label }) => {
        const isActive = activeTab === tabName;
        const baseClasses = "px-6 py-3 font-semibold rounded-t-lg transition-colors";
        const activeClasses = "bg-light-card border-b-2 border-primary text-primary";
        const inactiveClasses = "text-light-text hover:text-dark-text";
        return (
            <button onClick={() => setActiveTab(tabName)} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
                {label}
            </button>
        )
    }

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-dark-text">Comunicação</h2>
            </div>
            <div className="flex justify-between items-center border-b border-gray-200">
                <nav className="-mb-px flex space-x-4">
                    <TabButton tabName="announcements" label="Avisos e Agenda"/>
                    <TabButton tabName="chat" label="Mensagens Diretas"/>
                </nav>
                {activeTab === 'chat' && (
                     <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-dark-text">Espaços de equipe</span>
                        <button 
                            onClick={() => setIsCreateGroupModalOpen(true)}
                            title="Criar um espaço de equipe"
                            className="p-0.5 bg-primary rounded-lg shadow-sm hover:opacity-90 transition"
                        >
                            <div className="w-7 h-7 bg-black rounded-md flex items-center justify-center">
                                <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M4 11h6V8l4 4-4 4v-3H4v-2zm16 0h-6v3l-4-4 4-4v3h6v2z" />
                                </svg>
                            </div>
                        </button>
                    </div>
                )}
            </div>
            <div className="flex-grow bg-light-card mt-4 rounded-xl border border-gray-200 p-6">
                {renderTabContent()}
            </div>
        </div>
    );
}

export default CommunicationView;