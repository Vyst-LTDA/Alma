/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
import React from 'react';

interface NotificationsDropdownProps {
  isOpen: boolean;
  notifications: {
      id: number;
      icon: React.ReactNode;
      text: string;
      time: string;
  }[];
}

const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({ isOpen, notifications }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-80 bg-light-card rounded-lg shadow-lg border border-gray-200 z-50">
      <div className="p-3 border-b border-gray-200">
        <h3 className="font-bold text-dark-text">Notificações</h3>
      </div>
      <ul className="py-1 max-h-80 overflow-y-auto">
        {notifications.length > 0 ? notifications.map(notif => (
            <li key={notif.id} className="flex items-start px-4 py-3 hover:bg-gray-100 cursor-pointer">
                <div className="flex-shrink-0 mt-0.5">{notif.icon}</div>
                <div className="ml-3">
                    <p className="text-sm text-dark-text">{notif.text}</p>
                    <p className="text-xs text-light-text mt-1">{notif.time}</p>
                </div>
            </li>
        )) : (
            <li className="px-4 py-3 text-center text-sm text-light-text">Nenhuma notificação nova.</li>
        )}
      </ul>
      <div className="p-2 border-t border-gray-200 text-center">
        <a href="#" className="text-sm font-semibold text-primary hover:underline">Ver todas</a>
      </div>
    </div>
  );
};

export default NotificationsDropdown;