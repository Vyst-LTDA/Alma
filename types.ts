/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
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

export interface UpdateLossDto {
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

export interface Address extends AddressInfo {}

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

export type ScriptLanguage = 'javascript' | 'python';

export interface ScriptDto {
    id: string;
    name: string;
    content: string;
    language: number; // The API sends a number (1: JS, 2: Python)
}

export interface CreateScriptCommand {
    name: string;
    content: string;
    language: number; // 1 for JavaScript, 2 for Python
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

export interface UpdateHookCommand {
    id: string;
    hookName: string;
    scriptId: string;
}

export interface TestScriptCommand {
    scriptContent: string;
    context: any;
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


// --- START: Added types from Swagger.json ---

// Types for Attribute Mapping
export interface CreateAttributeMappingCommand {
    identityProviderId: string;
    sourceClaim: string;
    targetProperty: string;
}

// Types for Financials
export enum AccountType {
    Asset = 1,
    Liability = 2,
    Equity = 3,
    Revenue = 4,
    Expense = 5
}

export interface AccountDto {
    id: string;
    tenantId: string;
    name: string;
    code: string;
    type: AccountType;
    parentAccountId?: string;
    isActive: boolean;
    currentBalance: number;
}

export type AccountDtoPagedResult = PagedResult<AccountDto>;

export interface CreateAccountCommand {
    tenantId: string;
    name: string;
    code: string;
    type: AccountType;
    parentAccountId?: string;
}

export interface TransactionLine {
    accountId: string;
    debit: number;
    credit: number;
}

export interface CreateJournalEntryCommand {
    tenantId: string;
    date: string; // ISO date string
    description: string;
    transactions: TransactionLine[];
    correlationId: string;
}

export interface GeneralLedgerEntryDto {
    transactionId: string;
    journalEntryId: string;
    date: string; // ISO date string
    description: string;
    accountId: string;
    accountName: string;
    accountCode: string;
    debit: number;
    credit: number;
    balanceAfterTransaction: number;
}

export type GeneralLedgerEntryDtoPagedResult = PagedResult<GeneralLedgerEntryDto>;

// Types for Identity Providers
export enum FederationProtocol {
    OpenIdConnect = 0,
    Saml2 = 1
}

export interface CreateIdentityProviderCommand {
    name: string;
    displayName: string;
    protocol: FederationProtocol;
    isEnabled: boolean;
    clientId?: string;
    clientSecret?: string;
    authority?: string;
    scopes?: string;
    metadataUrl?: string;
    entityId?: string;
}

export interface UpdateIdentityProviderCommand {
    id: string;
    displayName: string;
    isEnabled: boolean;
    clientId?: string;
    clientSecret?: string;
    authority?: string;
    scopes?: string;
    metadataUrl?: string;
    entityId?: string;
}

// Types for Invoices
export enum InvoiceStatus {
    Draft = 0,
    Sent = 1,
    Paid = 2,
    Overdue = 3,
    Void = 4
}

export interface InvoiceLineItemDto {
    id: string;
    itemId: string;
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

export interface InvoiceDto {
    id: string;
    tenantId: string;
    salesOrderId: string;
    customerId: string;
    customerName: string;
    issueDate: string; // ISO date string
    dueDate: string; // ISO date string
    status: InvoiceStatus;
    totalAmount: number;
    lineItems: InvoiceLineItemDto[];
}

export type InvoiceDtoPagedResult = PagedResult<InvoiceDto>;

export interface RegisterPaymentRequest {
    amountPaid: number;
}

// Types for Policies
export interface CreatePolicyCommand {
    name: string;
    description: string;
    content: string;
}

export interface UpdatePolicyCommand {
    id: string;
    description: string;
    content: string;
}

// Types for Quotes
export enum QuoteStatus {
    Draft = 1,
    Sent = 2,
    Accepted = 3,
    Rejected = 4,
    Expired = 5
}

export interface QuoteLine {
    itemId: string;
    description: string;
    quantity: number;
    unitPrice: number;
}

export interface CreateQuoteCommand {
    tenantId: string;
    customerId: string;
    validUntil: string; // ISO date string
    lineItems: QuoteLine[];
}

export interface QuoteLineItemDto {
    id: string;
    itemId: string;
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

export interface QuoteDto {
    id: string;
    tenantId: string;
    customerId: string;
    customerName: string;
    issueDate: string; // ISO date string
    validUntil: string; // ISO date string
    status: QuoteStatus;
    totalAmount: number;
    lineItems: QuoteLineItemDto[];
}

export type QuoteDtoPagedResult = PagedResult<QuoteDto>;


// Types for Roles
export interface CreateRoleRequestDto {
    name: string;
}

export interface AssignPermissionsToRoleRequestDto {
    roleId: string;
    permissionIds: string[];
}

// Types for Sales Orders
export enum SalesOrderStatus {
    Pending = 0,
    Confirmed = 1,
    Shipped = 2,
    Invoiced = 3,
    Cancelled = 4
}

export interface CreateSalesOrderFromQuoteRequest {
    tenantId: string;
    shippingAddress: Address;
    billingAddress: Address;
}

export interface SalesOrderLineItemDto {
    id: string;
    itemId: string;
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

export interface SalesOrderDto {
    id: string;
    tenantId: string;
    customerId: string;
    customerName: string;
    quoteId: string;
    orderDate: string; // ISO date string
    status: SalesOrderStatus;
    totalAmount: number;
    lineItems: SalesOrderLineItemDto[];
}

export type SalesOrderDtoPagedResult = PagedResult<SalesOrderDto>;

// Types for Schemas
export enum DataType {
    String = 0,
    Number = 1,
    Boolean = 2,
    DateTime = 3,
    Reference = 4,
    Object = 5
}

export interface FieldDefinitionDto {
    id: string;
    entitySchemaId: string;
    name: string;
    type: DataType;
    isRequired: boolean;
    optionsJson?: string;
    validationRegex?: string;
    defaultValue?: string;
}

export interface EntitySchemaDto {
    id: string;
    name: string;
    description: string;
    fields: FieldDefinitionDto[];
}

export interface CreateFieldRequestDto {
    name: string;
    type: DataType;
    isRequired: boolean;
    parentId?: string;
    optionsJson?: string;
    validationRegex?: string;
    defaultValue?: string;
}

export interface UpdateFieldRequestDto {
    isRequired?: boolean;
    optionsJson?: string;
    validationRegex?: string;
    defaultValue?: string;
}

// Types for Tenants
export interface CreateTenantRequest {
    name: string;
}

export interface AssignHomeRegionRequest {
    homeRegion: string;
}

// Types for Workflows
export interface CreateWorkflowRequestDto {
    name: string;
    triggerEvent: string;
    bpmnDefinition: string;
    isActive: boolean;
}

export interface UpdateWorkflowRequestDto {
    name?: string;
    triggerEvent?: string;
    bpmnDefinition?: string;
    isActive?: boolean;
}

export interface WorkflowDto {
    id: string;
    name: string;
    triggerEvent: string;
    bpmnDefinition: string;
    isActive: boolean;
}

export interface ZeebeVariableDto {
    name: string;
    value: any;
}

export interface ZeebeProcessInstanceDto {
    id: string;
    status: string;
    processDefinitionId: string;
    variables: ZeebeVariableDto[];
}
// --- END: Added types from Swagger.json ---