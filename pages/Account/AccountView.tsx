/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
import React, { useState } from 'react';
import { UserData, UserRole } from '../../types';
import { UserCircleIcon, LockClosedIcon, ArrowUturnLeftIcon } from '../../components/shared/IconComponents';
import ProfileSettings from './components/ProfileSettings';
import SecuritySettings from './components/SecuritySettings';

interface AccountViewProps {
    userRole: UserRole;
    userData: UserData;
    onUpdateUserData: (newUserData: Partial<UserData>) => void;
    onNavigate: (view: string) => void;
}

type AccountTab = 'profile' | 'security';

const AccountView: React.FC<AccountViewProps> = ({ userRole, userData, onUpdateUserData, onNavigate }) => {
    const [activeTab, setActiveTab] = useState<AccountTab>('profile');

    const NavButton: React.FC<{ tabName: AccountTab, label: string, icon: React.ElementType }> = ({ tabName, label, icon: Icon }) => {
        const isActive = activeTab === tabName;
        const baseClasses = "flex items-center w-full px-4 py-3 text-sm font-semibold rounded-lg transition-colors duration-200";
        const activeClasses = "bg-primary/10 text-primary";
        const inactiveClasses = "text-dark-text hover:bg-gray-100";
        return (
            <button onClick={() => setActiveTab(tabName)} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
                <Icon className="w-5 h-5 mr-3" />
                <span>{label}</span>
            </button>
        )
    };

    const renderTabContent = () => {
        switch(activeTab) {
            case 'profile':
                return <ProfileSettings userData={userData} onUpdate={onUpdateUserData} />;
            case 'security':
                return <SecuritySettings />;
            default:
                return null;
        }
    }

    return (
        <div className="h-full">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => onNavigate('dashboard')} className="p-2 rounded-full hover:bg-gray-200 transition-colors" aria-label="Voltar">
                    <ArrowUturnLeftIcon className="w-6 h-6 text-dark-text" />
                </button>
                <h2 className="text-2xl font-bold text-dark-text">Minha Conta</h2>
            </div>
            <div className="flex flex-col lg:flex-row gap-8 h-full">
                {/* Left Navigation */}
                <aside className="w-full lg:w-1/4 xl:w-1/5">
                    <nav className="space-y-2">
                        <NavButton tabName="profile" label="Perfil" icon={UserCircleIcon} />
                        <NavButton tabName="security" label="Alterar senha" icon={LockClosedIcon} />
                    </nav>
                </aside>

                {/* Right Content */}
                <main className="flex-1 bg-light-card p-8 rounded-xl border border-gray-200">
                   {renderTabContent()}
                </main>
            </div>
        </div>
    );
};

export default AccountView;