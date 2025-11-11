/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
import { 
    CreateItemRequestDto, ItemDto, PagedResult, RegisterUserRequestDto, UserDto, 
    UserDtoPagedResult, MovementDto, MovementDtoPagedResult, RegisterMovementRequestDto, 
    UpdateProfileRequestDto, ChangePasswordRequestDto, VersionInfo, UpdateStatusInfo, 
    ScriptDto, CreateScriptCommand, UpdateScriptCommand, HookDto, CreateHookCommand, 
    WebhookSubscriptionDto, CreateWebhookSubscriptionCommand, CustomerDto, CustomerDtoPagedResult, CreateCustomerCommand,
    UpdateItemRequestDto,
    LossDto,
    CreateLossDto,
    UpdateLossDto,
    ApiKeyDto,
    CreateApiKeyRequestDto,
    ApiKeyCreatedDto,
    UpdateUserRequestDto,
    AuditLogDtoPagedResult,
    UpdateHookCommand,
    TestScriptCommand,
    CreateAttributeMappingCommand,
    CreateAccountCommand,
    AccountDtoPagedResult,
    CreateJournalEntryCommand,
    GeneralLedgerEntryDtoPagedResult,
    UpdateIdentityProviderCommand,
    CreateIdentityProviderCommand,
    InvoiceDtoPagedResult,
    RegisterPaymentRequest,
    UpdatePolicyCommand,
    CreatePolicyCommand,
    CreateQuoteCommand,
    QuoteDtoPagedResult,
    AssignPermissionsToRoleRequestDto,
    CreateRoleRequestDto,
    CreateSalesOrderFromQuoteRequest,
    SalesOrderDtoPagedResult,
    EntitySchemaDto,
    CreateFieldRequestDto,
    UpdateFieldRequestDto,
    CreateTenantRequest,
    AssignHomeRegionRequest,
    UpdateWorkflowRequestDto,
    WorkflowDto,
    CreateWorkflowRequestDto,
    ZeebeProcessInstanceDto
} from '../types';

// The API is served from the same origin, so we use a relative path.
const API_BASE_URL = ''; 

/**
 * Handles the response from the fetch API, parsing JSON and throwing errors for non-ok statuses.
 * @param response The response object from a fetch call.
 * @returns A promise that resolves with the JSON data.
 */
async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch (e) {
            errorData = { message: 'An unknown error occurred and the response was not valid JSON.' };
        }
        
        const errorMessage = errorData?.title || errorData?.detail || errorData?.message || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
    }
    
    const contentType = response.headers.get("content-type");
    const text = await response.text();

    if (text.length === 0) {
        return {} as T; // For 204 No Content or other empty bodies
    }

    if (contentType && contentType.includes("application/json")) {
        try {
            return JSON.parse(text) as T;
        } catch (e) {
            // If JSON parsing fails but it's a success response, it might just be text
            return text as T;
        }
    }
    
    // For text/plain responses (like UUIDs from 201 or script IDs from 200)
    return text as T;
}

// --- Items ---
export const getItems = async (params: { pageNumber?: number, pageSize?: number, searchTerm?: string }): Promise<PagedResult<ItemDto>> => {
    const query = new URLSearchParams();
    if (params.pageNumber) query.append('PageNumber', params.pageNumber.toString());
    if (params.pageSize) query.append('PageSize', params.pageSize.toString());
    if (params.searchTerm) query.append('SearchTerm', params.searchTerm);
    const response = await fetch(`${API_BASE_URL}/api/v1/Items?${query.toString()}`);
    return handleResponse<PagedResult<ItemDto>>(response);
};

export const getItemById = async (id: string): Promise<ItemDto> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/Items/${id}`);
    return handleResponse<ItemDto>(response);
};

export const createItem = async (itemData: CreateItemRequestDto): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/Items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData),
    });
    return handleResponse<any>(response);
};

export const updateItem = async (id: string, itemData: UpdateItemRequestDto): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/Items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData),
    });
    return handleResponse<void>(response);
};

export const deleteItem = async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/Items/${id}`, {
        method: 'DELETE',
    });
    return handleResponse<void>(response);
};


// --- Users ---
export const getUsers = async (params: { pageNumber?: number, pageSize?: number, searchTerm?: string, sortBy?: string, sortOrder?: string }): Promise<UserDtoPagedResult> => {
    const query = new URLSearchParams();
    if (params.pageNumber) query.append('PageNumber', params.pageNumber.toString());
    if (params.pageSize) query.append('PageSize', params.pageSize.toString());
    if (params.searchTerm) query.append('SearchTerm', params.searchTerm);
    if (params.sortBy) query.append('SortBy', params.sortBy);
    if (params.sortOrder) query.append('SortOrder', params.sortOrder);
    const response = await fetch(`${API_BASE_URL}/api/v1/Users?${query.toString()}`);
    return handleResponse<UserDtoPagedResult>(response);
};

export const getUserById = async (id: string): Promise<UserDto> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/Users/${id}`);
    return handleResponse<UserDto>(response);
};

export const createUser = async (userData: RegisterUserRequestDto): Promise<UserDto> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/Users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });
    return handleResponse<UserDto>(response);
};

export const updateUser = async (id: string, userData: UpdateUserRequestDto): Promise<UserDto> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/Users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });
    return handleResponse<UserDto>(response);
};

export const deleteUser = async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/Users/${id}`, {
        method: 'DELETE',
    });
    return handleResponse<void>(response);
};

export const updateCurrentUserProfile = async (profileData: UpdateProfileRequestDto): Promise<UserDto> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/Users/me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
    });
    return handleResponse<UserDto>(response);
};

export const changeCurrentUserPassword = async (passwordData: ChangePasswordRequestDto): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/Users/me/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(passwordData),
    });
    await handleResponse<void>(response);
};

// --- Movements ---
export const getMovements = async (params: { pageNumber?: number, pageSize?: number, searchTerm?: string }): Promise<MovementDtoPagedResult> => {
    const query = new URLSearchParams();
    if (params.pageNumber) query.append('PageNumber', params.pageNumber.toString());
    if (params.pageSize) query.append('PageSize', params.pageSize.toString());
    if (params.searchTerm) query.append('SearchTerm', params.searchTerm);
    const response = await fetch(`${API_BASE_URL}/api/v1/Movements?${query.toString()}`);
    return handleResponse<MovementDtoPagedResult>(response);
};

export const getMovementById = async (id: string): Promise<MovementDto> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/Movements/${id}`);
    return handleResponse<MovementDto>(response);
};

export const getMovementsByUser = async (userId: string): Promise<MovementDto[]> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/Movements/by-user/${userId}`);
    return handleResponse<MovementDto[]>(response);
};

export const getMovementsByItemId = async (itemId: string): Promise<MovementDto[]> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/Movements/by-item/${itemId}`);
    return handleResponse<MovementDto[]>(response);
};

export const createCheckoutMovement = async (movementData: RegisterMovementRequestDto): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/Movements/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movementData),
    });
    return handleResponse<any>(response);
};

export const createCheckinMovement = async (movementData: RegisterMovementRequestDto): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/Movements/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movementData),
    });
    return handleResponse<any>(response);
};

// --- Customers (replaces Suppliers) ---
export const getCustomers = async (params: { pageNumber?: number, pageSize?: number }): Promise<CustomerDtoPagedResult> => {
    const query = new URLSearchParams();
    if (params.pageNumber) query.append('pageNumber', params.pageNumber.toString());
    if (params.pageSize) query.append('pageSize', params.pageSize.toString());
    const response = await fetch(`${API_BASE_URL}/api/v1/Customers?${query.toString()}`);
    return handleResponse<CustomerDtoPagedResult>(response);
};

export const searchCustomers = async (term: string): Promise<CustomerDto[]> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/Customers/search?term=${encodeURIComponent(term)}`);
    return handleResponse<CustomerDto[]>(response);
};

export const createCustomer = async (customerData: CreateCustomerCommand): Promise<string> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/Customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerData),
    });
    return handleResponse<string>(response); // API returns the new ID as a string
};


// --- System ---
export const getSystemVersion = async (): Promise<VersionInfo> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/System/version`);
    return handleResponse<VersionInfo>(response);
};

export const getUpdateStatus = async (): Promise<UpdateStatusInfo> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/System/update-status`);
    return handleResponse<UpdateStatusInfo>(response);
};

// --- Scripts ---
export const getScripts = async (): Promise<ScriptDto[]> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/scripts`);
    return handleResponse<ScriptDto[]>(response);
};

export const getScriptById = async (id: string): Promise<ScriptDto> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/scripts/${id}`);
    return handleResponse<ScriptDto>(response);
};

export const createScript = async (scriptData: CreateScriptCommand): Promise<string> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/scripts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scriptData),
    });
    return handleResponse<string>(response); // Assuming API returns the new ID
};

export const updateScript = async (scriptData: UpdateScriptCommand): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/scripts/${scriptData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scriptData),
    });
    return handleResponse<void>(response);
};

export const deleteScript = async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/scripts/${id}`, { method: 'DELETE' });
    return handleResponse<void>(response);
};

export const testScript = async (command: TestScriptCommand): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/scripts/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(command),
    });
    return handleResponse<any>(response);
};

// --- Hooks ---
export const getHooks = async (): Promise<HookDto[]> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/hooks`);
    return handleResponse<HookDto[]>(response);
};

export const getHookById = async (id: string): Promise<HookDto> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/hooks/${id}`);
    return handleResponse<HookDto>(response);
};

export const createHook = async (hookData: CreateHookCommand): Promise<string> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/hooks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hookData),
    });
    return handleResponse<string>(response);
};

export const updateHook = async (command: UpdateHookCommand): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/hooks/${command.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(command),
    });
    return handleResponse<void>(response);
};

export const deleteHook = async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/hooks/${id}`, { method: 'DELETE' });
    return handleResponse<void>(response);
};

// --- Webhooks ---
export const getWebhooks = async (): Promise<WebhookSubscriptionDto[]> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/webhooks`);
    return handleResponse<WebhookSubscriptionDto[]>(response);
};

export const getWebhookById = async (id: string): Promise<WebhookSubscriptionDto> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/webhooks/${id}`);
    return handleResponse<WebhookSubscriptionDto>(response);
};

export const createWebhook = async (webhookData: CreateWebhookSubscriptionCommand): Promise<string> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/webhooks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(webhookData),
    });
    return handleResponse<string>(response);
};

export const deleteWebhook = async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/webhooks/${id}`, { method: 'DELETE' });
    return handleResponse<void>(response);
};

// --- API Keys ---
export const getApiKeys = async (): Promise<ApiKeyDto[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/apikeys`);
        if (response.status === 404) return [];
        return handleResponse<ApiKeyDto[]>(response);
    } catch (e) {
        console.warn("getApiKeys falhou, retornando array vazio. O endpoint pode não estar implementado no backend.", e);
        return [];
    }
};

export const getApiKeyById = async (id: string): Promise<ApiKeyDto> => {
    const response = await fetch(`${API_BASE_URL}/api/apikeys/${id}`);
    return handleResponse<ApiKeyDto>(response);
};

export const createApiKey = async (keyData: CreateApiKeyRequestDto): Promise<ApiKeyCreatedDto> => {
    const response = await fetch(`${API_BASE_URL}/api/apikeys`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(keyData),
    });
    return handleResponse<ApiKeyCreatedDto>(response);
};

export const deleteApiKey = async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/apikeys/${id}`, {
        method: 'DELETE',
    });
    return handleResponse<void>(response);
};


// --- Losses ---
export const getLosses = async (): Promise<LossDto[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/losses`);
        if (response.status === 404) return [];
        return handleResponse<LossDto[]>(response);
    } catch (e) {
        console.warn("getLosses falhou, retornando array vazio. O endpoint pode não estar implementado no backend.", e);
        return [];
    }
};

export const getLossById = async (id: string): Promise<LossDto> => {
    const response = await fetch(`${API_BASE_URL}/api/losses/${id}`);
    return handleResponse<LossDto>(response);
};

export const createLoss = async (lossData: CreateLossDto): Promise<LossDto> => {
    const response = await fetch(`${API_BASE_URL}/api/losses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lossData),
    });
    return handleResponse<LossDto>(response);
};

export const updateLoss = async (id: string, lossData: UpdateLossDto): Promise<LossDto> => {
    const response = await fetch(`${API_BASE_URL}/api/losses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lossData),
    });
    return handleResponse<LossDto>(response);
};

export const deleteLoss = async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/losses/${id}`, {
        method: 'DELETE',
    });
    return handleResponse<void>(response);
};

// --- Audit Logs ---
export const getAuditLogs = async (params: { 
    pageNumber?: number, 
    pageSize?: number, 
    startDate?: string, 
    endDate?: string, 
    userId?: string, 
    eventType?: string 
}): Promise<AuditLogDtoPagedResult> => {
    const query = new URLSearchParams();
    if (params.pageNumber) query.append('Page', params.pageNumber.toString());
    if (params.pageSize) query.append('PageSize', params.pageSize.toString());
    if (params.startDate) query.append('StartDate', params.startDate);
    if (params.endDate) query.append('EndDate', params.endDate);
    if (params.userId) query.append('UserId', params.userId);
    if (params.eventType) query.append('EventType', params.eventType);
    
    const response = await fetch(`${API_BASE_URL}/api/v1/audit?${query.toString()}`);
    return handleResponse<AuditLogDtoPagedResult>(response);
};

// --- Admin ---
export const getAggregateHistory = async (id: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/admin/aggregates/${id}/history`);
    return handleResponse(response);
};

export const rebuildProjections = async (): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/admin/projections/rebuild`, { method: 'POST' });
    return handleResponse(response);
};

// --- Attribute Mapping ---
export const createAttributeMapping = async (command: CreateAttributeMappingCommand): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/attribute-mappings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(command),
    });
    return handleResponse(response);
};


// --- Dashboard ---
export const getDashboardMetrics = async (): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/dashboard/metrics`);
    return handleResponse(response);
};

// --- Financials ---
export const createAccount = async (command: CreateAccountCommand): Promise<string> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/Financials/accounts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(command),
    });
    return handleResponse(response);
};

export const getAccounts = async (params: { pageNumber?: number, pageSize?: number }): Promise<AccountDtoPagedResult> => {
    const query = new URLSearchParams(params as any);
    const response = await fetch(`${API_BASE_URL}/api/v1/Financials/accounts?${query.toString()}`);
    return handleResponse(response);
};

export const createJournalEntry = async (command: CreateJournalEntryCommand): Promise<string> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/Financials/journal-entries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(command),
    });
    return handleResponse(response);
};

export const getGeneralLedger = async (params: { pageNumber?: number, pageSize?: number, startDate?: string, endDate?: string, accountId?: string }): Promise<GeneralLedgerEntryDtoPagedResult> => {
    const query = new URLSearchParams(params as any);
    const response = await fetch(`${API_BASE_URL}/api/v1/Financials/general-ledger?${query.toString()}`);
    return handleResponse(response);
};


// --- Identity Providers ---
export const createIdentityProvider = async (command: CreateIdentityProviderCommand): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/identity-providers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(command),
    });
    return handleResponse(response);
};

export const getIdentityProviders = async (): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/identity-providers`);
    return handleResponse(response);
};

export const updateIdentityProvider = async (id: string, command: UpdateIdentityProviderCommand): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/identity-providers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(command),
    });
    return handleResponse(response);
};

export const getIdentityProviderById = async (id: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/identity-providers/${id}`);
    return handleResponse(response);
};

// --- Invoices ---
export const getInvoices = async (params: { pageNumber?: number, pageSize?: number }): Promise<InvoiceDtoPagedResult> => {
    const query = new URLSearchParams(params as any);
    const response = await fetch(`${API_BASE_URL}/api/v1/invoices?${query.toString()}`);
    return handleResponse(response);
};

export const registerInvoicePayment = async (id: string, request: RegisterPaymentRequest): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/invoices/${id}/register-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
    });
    return handleResponse(response);
};

// --- Policies ---
export const createPolicy = async (command: CreatePolicyCommand): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/policies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(command),
    });
    return handleResponse(response);
};

export const getPolicies = async (): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/policies`);
    return handleResponse(response);
};

export const getPolicyById = async (id: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/policies/${id}`);
    return handleResponse(response);
};

export const updatePolicy = async (id: string, command: UpdatePolicyCommand): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/policies/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(command),
    });
    return handleResponse(response);
};

export const deletePolicy = async (id: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/policies/${id}`, { method: 'DELETE' });
    return handleResponse(response);
};

export const publishPolicy = async (id: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/policies/${id}/publish`, { method: 'POST' });
    return handleResponse(response);
};

// --- Quotes ---
export const createQuote = async (command: CreateQuoteCommand): Promise<string> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/sales/quotes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(command),
    });
    return handleResponse(response);
};

export const getQuotes = async (params: { pageNumber?: number, pageSize?: number }): Promise<QuoteDtoPagedResult> => {
    const query = new URLSearchParams(params as any);
    const response = await fetch(`${API_BASE_URL}/api/v1/sales/quotes?${query.toString()}`);
    return handleResponse(response);
};

export const sendQuote = async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/sales/quotes/${id}/send`, { method: 'PUT' });
    return handleResponse(response);
};

export const acceptQuote = async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/sales/quotes/${id}/accept`, { method: 'PUT' });
    return handleResponse(response);
};

export const rejectQuote = async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/sales/quotes/${id}/reject`, { method: 'PUT' });
    return handleResponse(response);
};

// --- Reports ---
export const getSalesAnalyticsReport = async (params: { startDate?: string, endDate?: string }): Promise<any> => {
    const query = new URLSearchParams(params as any);
    const response = await fetch(`${API_BASE_URL}/api/v1/reports/sales-analytics?${query.toString()}`);
    return handleResponse(response);
};

// --- Roles ---
export const createRole = async (request: CreateRoleRequestDto): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/Roles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
    });
    return handleResponse(response);
};

export const getRoles = async (): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/Roles`);
    return handleResponse(response);
};

export const getRoleById = async (id: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/Roles/${id}`);
    return handleResponse(response);
};

export const assignPermissionsToRole = async (request: AssignPermissionsToRoleRequestDto): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/Roles/assign-permissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
    });
    return handleResponse(response);
};

export const getPermissions = async (): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/Roles/permissions`);
    return handleResponse(response);
};

// --- Sales Orders ---
export const createSalesOrderFromQuote = async (quoteId: string, request: CreateSalesOrderFromQuoteRequest): Promise<string> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/sales/orders/from-quote/${quoteId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
    });
    return handleResponse(response);
};

export const billSalesOrder = async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/sales/orders/${id}/bill`, { method: 'POST' });
    return handleResponse(response);
};

export const getSalesOrders = async (params: { pageNumber?: number, pageSize?: number }): Promise<SalesOrderDtoPagedResult> => {
    const query = new URLSearchParams(params as any);
    const response = await fetch(`${API_BASE_URL}/api/v1/sales/orders?${query.toString()}`);
    return handleResponse(response);
};

// --- Schemas ---
export const getEntitySchema = async (entityName: string): Promise<EntitySchemaDto> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/schemas/${entityName}`);
    return handleResponse(response);
};

export const createSchemaField = async (entityName: string, request: CreateFieldRequestDto): Promise<string> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/schemas/${entityName}/fields`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
    });
    return handleResponse(response);
};

export const updateSchemaField = async (entityName: string, fieldName: string, request: UpdateFieldRequestDto): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/schemas/${entityName}/fields/${fieldName}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
    });
    return handleResponse(response);
};

export const deleteSchemaField = async (entityName: string, fieldName: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/schemas/${entityName}/fields/${fieldName}`, { method: 'DELETE' });
    return handleResponse(response);
};

// --- Tenants ---
export const createTenant = async (request: CreateTenantRequest): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/api/Tenants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
    });
    return handleResponse(response);
};

export const getTenantById = async (id: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/api/Tenants/${id}`);
    return handleResponse(response);
};

export const assignTenantHomeRegion = async (id: string, request: AssignHomeRegionRequest): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/api/Tenants/${id}/home-region`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
    });
    return handleResponse(response);
};

// --- Webhook Deliveries ---
export const getWebhookDeliveries = async (subscriptionId: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/webhook-deliveries/${subscriptionId}`);
    return handleResponse(response);
};

export const redeliverWebhook = async (deliveryId: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/webhook-deliveries/${deliveryId}/redeliver`, { method: 'POST' });
    return handleResponse(response);
};

// --- Workflows ---
export const createWorkflow = async (request: CreateWorkflowRequestDto): Promise<string> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/workflows`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
    });
    return handleResponse(response);
};

export const getWorkflowById = async (id: string): Promise<WorkflowDto> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/workflows/${id}`);
    return handleResponse(response);
};

export const updateWorkflow = async (id: string, request: UpdateWorkflowRequestDto): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/workflows/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
    });
    return handleResponse(response);
};

export const createWorkflowInstance = async (id: string, variables: any): Promise<string> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/workflows/${id}/instances`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(variables),
    });
    return handleResponse(response);
};

export const getWorkflowInstance = async (instanceId: string): Promise<ZeebeProcessInstanceDto> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/workflows/instances/${instanceId}`);
    return handleResponse(response);
};