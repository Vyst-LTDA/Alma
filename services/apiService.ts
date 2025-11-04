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
    WebhookSubscriptionDto, CreateWebhookSubscriptionCommand, CustomerDtoPagedResult, CreateCustomerCommand
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

export const createItem = async (itemData: CreateItemRequestDto): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/Items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData),
    });
    return handleResponse<any>(response);
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

export const createUser = async (userData: RegisterUserRequestDto): Promise<UserDto> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/Users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });
    return handleResponse<UserDto>(response);
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

export const getMovementsByUser = async (userId: string): Promise<MovementDto[]> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/Movements/by-user/${userId}`);
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

// --- Hooks ---
export const getHooks = async (): Promise<HookDto[]> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/hooks`);
    return handleResponse<HookDto[]>(response);
};

export const createHook = async (hookData: CreateHookCommand): Promise<string> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/hooks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hookData),
    });
    return handleResponse<string>(response);
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