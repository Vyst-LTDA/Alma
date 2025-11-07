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

// FIX: Add ChartConfig interface to be used across the application
export interface ChartConfig {
    id: string;
    title: string;
    type: 'bar' | 'pie' | 'line' | 'area' | 'verticalBar';
    data: any[];
    dataKey: string;
    nameKey: string;
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

export interface LossDto {
    id: string;
    itemCode: string;
    itemName: string;
    quantity: number;
    reason: string;
    wasInStock: boolean;
    recordedBy: string; // User Name
    lossDate: string; // ISO Date String
    category?: string;
}

export interface CreateLossDto {
    itemId: string;
    quantity: number;
    reason: string;
    wasInStock: boolean;
}

// Types for Customers from API
export interface AddressInfo {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
}

export interface CreateCustomerCommand {
    tenantId: string;
    name: string;
    taxId: string;
    billingAddress: AddressInfo;
    shippingAddress: AddressInfo;
}

export interface CustomerDto {
    id: string;
    tenantId: string;
    name: string;
    taxId: string;
    billingAddress: AddressDto;
    shippingAddress: AddressDto;
    isActive: boolean;
}

export interface AddressDto {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
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

export interface UpdateItemRequestDto {
    name: string;
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

export type CustomerDtoPagedResult = PagedResult<CustomerDto>;

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

// FIX: Add UpdateProfileRequestDto and ChangePasswordRequestDto to fix missing type errors.
export interface UpdateProfileRequestDto {
    fullName: string;
    email: string;
}

export interface ChangePasswordRequestDto {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

export interface UpdateUserRequestDto {
    fullName?: string;
    email?: string;
    role?: string;
    isActive?: boolean;
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

// Types for Server Management
export interface VersionInfo {
    version: string;
}

export interface UpdateStatusInfo {
    isUpdateAvailable: boolean;
    latestVersion?: string;
}

export type ScriptLanguage = 'javascript' | 'python' | 'lua';

export interface ScriptDto {
    id: string;
    name: string;
    content: string;
    language: ScriptLanguage; // Assuming the API returns a string representation
}

export interface CreateScriptCommand {
    name: string;
    content: string;
    language: number; // 1 for JavaScript, 2 for Python, 3 for Lua
}

export interface UpdateScriptCommand {
    id: string;
    name: string;
    content: string;
    language: number;
}

export interface HookDto {
    id: string;
    scriptId: string;
    hookName: string;
}

export interface CreateHookCommand {
    scriptId: string;
    hookName: string;
}

export interface WebhookSubscriptionDto {
    id: string;
    eventType: string;
    targetUrl: string;
    isActive: boolean;
}

export interface CreateWebhookSubscriptionCommand {
    eventType: string;
    targetUrl: string;
}

// Types for API Keys
export interface ApiKeyDto {
  id: string;
  name: string;
  keyPrefix: string;
  permissions: string;
  createdAt: string;
  isActive: boolean;
}

export interface CreateApiKeyRequestDto {
  name: string;
  permissions: 'read-write' | 'read-only';
}

export interface ApiKeyCreatedDto {
    id: string;
    fullKey: string;
    key: ApiKeyDto;
}

// Types for Audit Logs (inferred)
export interface AuditLogDto {
    id: string;
    timestamp: string;
    userId: string;
    userFullName: string | null;
    eventType: string;
    details: string;
}

export type AuditLogDtoPagedResult = PagedResult<AuditLogDto>;