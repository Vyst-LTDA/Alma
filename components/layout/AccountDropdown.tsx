import React from 'react';
import { UserCircleIcon, LogoutIcon } from '../shared/IconComponents';

interface AccountDropdownProps {
  isOpen: boolean;
  onLogout: () => void;
  onNavigateToAccount: () => void;
}

const AccountDropdown: React.FC<AccountDropdownProps> = ({ isOpen, onLogout, onNavigateToAccount }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-56 bg-light-card rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
      <ul className="py-2">
        <li>
            <button 
                onClick={onNavigateToAccount} 
                className="flex items-center w-full px-4 py-2 text-sm text-dark-text hover:bg-gray-100"
            >
                <UserCircleIcon className="w-5 h-5 mr-3" />
                <span>Gerenciar Conta</span>
            </button>
        </li>
      </ul>
      <div className="border-t border-gray-200">
         <button 
            onClick={onLogout} 
            className="flex items-center w-full px-4 py-3 text-sm text-dark-text hover:bg-gray-100"
        >
            <LogoutIcon className="w-5 h-5 mr-3" />
            <span>Sair</span>
        </button>
      </div>
    </div>
  );
};

export default AccountDropdown;