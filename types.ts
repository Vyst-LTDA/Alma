// Fix: Import React to resolve errors with React types.
import React from 'react';

export type UserRole = 'warehouse' | 'admin' | 'professor';

export interface UserData {
    name: string;
    avatar: string;
    email: string;
    cpf: string;
    linkedin?: string;
}

export interface NavItemType {
  name: string;
  icon: React.ElementType;
  view: string; // e.g., 'dashboard', 'communication'
  active?: boolean;
}

export interface StatCardType {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ReactNode;
}

export interface Request {
    id: string;
    item: string;
    category?: string; // e.g., 'Escritório', 'Eletrônicos', 'EPI'
    quantity: number;
    requester: string;
    status: 'Aprovado' | 'Pendente' | 'Recusado' | 'Entregue';
    requestDate: string;
    type: 'Empréstimo' | 'Uso Contínuo';
    rejectionReason?: string; // Motivo da recusa
    unit?: string;
    deliveryMethod?: 'Retirada' | 'Entrega';
    deliveryLocation?: string;
    returnDate?: string;
}

export interface Message {
    id: string;
    senderId: string;
    text: string;
    timestamp: string;
}

export interface Contact {
    id: string;
    name: string;
    avatar: string;
    role?: UserRole;
    email?: string;
    unreadCount?: number;
    isGroup?: boolean;
    members?: string[]; // array of member user IDs
}

export interface Supplier {
    id: string;
    name: string;
    cnpj: string;
    phone: string;
    email: string;
    address: string;
    category: string; // e.g., 'Eletrônicos', 'Material de Escritório'
}

export interface StockItem {
    id: string;
    code: string;
    name: string;
    category: string;
    quantity: number;
    status: 'Disponível' | 'Estoque Baixo' | 'Indisponível';
}

export interface LossRecord {
    id: string;
    itemCode: string;
    itemName: string;
    quantity: number;
    report: string;
    wasInStock: boolean;
    recordedBy: UserRole;
    date: string;
    category?: string;
}