/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
import React, { useState, useEffect, useRef } from 'react';
import { UserRole, UserData } from '../../types';
import { SearchIcon, BellIcon, UserCircleIcon } from '../shared/IconComponents';
import NotificationsDropdown from './NotificationsDropdown';
import AccountDropdown from './AccountDropdown';

interface HeaderProps {
    userRole: UserRole;
    userData: UserData;
    onLogout: () => void;
    onNavigate: (view: string) => void;
    notifications: any[];
    unreadCount: number;
    onOpenNotifications: () => void;
}

const roleNames = {
    professor: 'Docente',
    warehouse: 'Almoxarifado',
    admin: 'Administrador',
};

const Header: React.FC<HeaderProps> = ({ userRole, userData, onLogout, onNavigate, notifications, unreadCount, onOpenNotifications }) => {
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [accountMenuOpen, setAccountMenuOpen] = useState(false);

    const notificationsRef = useRef<HTMLDivElement>(null);
    const accountMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
                setNotificationsOpen(false);
            }
            if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
                setAccountMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    
    const handleBellClick = () => {
        setNotificationsOpen(prev => !prev);
        if (!notificationsOpen) {
            onOpenNotifications();
        }
    }
    
    return (
        <header className="h-20 bg-light-card border-b border-gray-200 flex items-center justify-between px-6 lg:px-8 flex-shrink-0">
            <div className="flex flex-col">
                <h1 className="text-xl font-bold text-dark-text">Bem-vindo(a), {userData.name.split(' ')[0] || 'Usuário'}!</h1>
                <p className="text-sm text-light-text">Painel do {roleNames[userRole]}</p>
            </div>
            
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-4">
                    <div className="relative" ref={notificationsRef}>
                        <button 
                            onClick={handleBellClick}
                            className="relative p-2 rounded-full hover:bg-gray-100 transition"
                        >
                            <BellIcon className="w-6 h-6 text-light-text" />
                            {unreadCount > 0 && (
                                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">
                                    {unreadCount}
                                </span>
                            )}
                        </button>
                        <NotificationsDropdown isOpen={notificationsOpen} notifications={notifications} />
                    </div>
                    
                    <div className="relative" ref={accountMenuRef}>
                         <button 
                            onClick={() => setAccountMenuOpen(prev => !prev)}
                            className="flex items-center space-x-3 cursor-pointer p-1 rounded-lg hover:bg-gray-100"
                        >
                            {userData.avatar ? (
                                <img src={userData.avatar} alt="User Avatar" className="w-10 h-10 rounded-full object-cover" />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                    <UserCircleIcon className="w-8 h-8 text-gray-400" />
                                </div>
                            )}
                            <div className="hidden md:block">
                                <p className="font-semibold text-dark-text capitalize">{userData.name || 'Usuário'}</p>
                            </div>
                        </button>
                        <AccountDropdown 
                            isOpen={accountMenuOpen} 
                            onLogout={onLogout}
                            onNavigateToAccount={() => {
                                onNavigate('account');
                                setAccountMenuOpen(false);
                            }}
                        />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;