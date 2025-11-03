// Fix: Import React to resolve errors with React types.
import React from 'react';

export type UserRole = 'warehouse' | 'admin' | 'professor';

export interface UserData {
    id: string;
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
    type: 'Empréstimo' | 'Uso Contínuo' | 'Entrada';
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

// Types from Swagger.json for Items
export interface ItemDto {
    id: string;
    name: string;
    sku: string;
    stockQuantity: number;
    createdAt: string;
    updatedAt: string | null;
    attributes: { [key: string]: any } | null;
}

export interface CreateItemRequestDto {
    name: string;
    sku: string;
    stockQuantity: number;
    attributes?: { [key: string]: any };
}

// Generic Paged Result
export interface PagedResult<T> {
    items: T[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

// Types from Swagger.json for Users
export interface UserDto {
    id: string;
    fullName: string | null;
    email: string | null;
    role: string | null;
    isActive: boolean;
    createdAt: string;
}

export interface RegisterUserRequestDto {
    fullName: string;
    email: string;
    password?: string; // Password might be optional if confirmation is sent via email
    role: string;
}

export type UserDtoPagedResult = PagedResult<UserDto>;

// Types from Swagger.json for Movements
export interface MovementDto {
    id: string;
    itemId: string;
    itemName: string | null;
    itemSku: string | null;
    userId: string;
    userFullName: string | null;
    type: string | null; // "CheckIn" or "CheckOut"
    quantity: number;
    movementDate: string;
    observations: string | null;
}

export type MovementDtoPagedResult = PagedResult<MovementDto>;

export interface RegisterMovementRequestDto {
    itemId: string;
    userId: string;
    quantity: number;
    observations?: string | null;
}