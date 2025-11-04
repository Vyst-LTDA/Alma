/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
import { CreateItemRequestDto, ItemDto, PagedResult, RegisterUserRequestDto, UserDto, UserDtoPagedResult, MovementDto, MovementDtoPagedResult, RegisterMovementRequestDto, UpdateProfileRequestDto, ChangePasswordRequestDto } from '../types';

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
    
    // Handle responses that might have an empty body on success (e.g., 201, 204)
    const contentType = response.headers.get("content-type");
    if (response.status === 204 || !contentType || !contentType.includes("application/json")) {
        return {} as T; // Return empty object for empty or non-JSON success responses
    }

    return response.json();
}

/**
 * Fetches a paginated list of items from the API.
 * Corresponds to: GET /api/v1/Items
 * @param params - The query parameters for pagination and searching.
 */
export const getItems = async (params: { pageNumber?: number, pageSize?: number, searchTerm?: string }): Promise<PagedResult<ItemDto>> => {
    const query = new URLSearchParams();
    if (params.pageNumber) query.append('PageNumber', params.pageNumber.toString());
    if (params.pageSize) query.append('PageSize', params.pageSize.toString());
    if (params.searchTerm) query.append('SearchTerm', params.searchTerm);

    const response = await fetch(`${API_BASE_URL}/api/v1/Items?${query.toString()}`);
    return handleResponse<PagedResult<ItemDto>>(response);
};

/**
 * Creates a new item via the API.
 * Corresponds to: POST /api/v1/Items
 * @param itemData - The data for the new item.
 */
export const createItem = async (itemData: CreateItemRequestDto): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/Items`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
    });

    // A non-ok response will be thrown by handleResponse
    return handleResponse<any>(response);
};

/**
 * Fetches a paginated list of users from the API.
 * Corresponds to: GET /api/v1/Users
 * @param params - The query parameters for pagination, searching, and sorting.
 */
export const getUsers = async (params: { 
    pageNumber?: number, 
    pageSize?: number, 
    searchTerm?: string,
    sortBy?: string,
    sortOrder?: string 
}): Promise<UserDtoPagedResult> => {
    const query = new URLSearchParams();
    if (params.pageNumber) query.append('PageNumber', params.pageNumber.toString());
    if (params.pageSize) query.append('PageSize', params.pageSize.toString());
    if (params.searchTerm) query.append('SearchTerm', params.searchTerm);
    if (params.sortBy) query.append('SortBy', params.sortBy);
    if (params.sortOrder) query.append('SortOrder', params.sortOrder);

    const response = await fetch(`${API_BASE_URL}/api/v1/Users?${query.toString()}`);
    return handleResponse<UserDtoPagedResult>(response);
};

/**
 * Creates a new user via the API.
 * Corresponds to: POST /api/v1/Users
 * @param userData - The data for the new user.
 */
export const createUser = async (userData: RegisterUserRequestDto): Promise<UserDto> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/Users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });
    return handleResponse<UserDto>(response);
};

/**
 * Fetches a paginated list of movements from the API.
 * Corresponds to: GET /api/v1/Movements
 */
export const getMovements = async (params: { 
    pageNumber?: number, 
    pageSize?: number, 
    searchTerm?: string 
}): Promise<MovementDtoPagedResult> => {
    const query = new URLSearchParams();
    if (params.pageNumber) query.append('PageNumber', params.pageNumber.toString());
    if (params.pageSize) query.append('PageSize', params.pageSize.toString());
    if (params.searchTerm) query.append('SearchTerm', params.searchTerm);

    const response = await fetch(`${API_BASE_URL}/api/v1/Movements?${query.toString()}`);
    return handleResponse<MovementDtoPagedResult>(response);
};

/**
 * Fetches movements for a specific user.
 * Corresponds to: GET /api/v1/Movements/by-user/{userId}
 */
export const getMovementsByUser = async (userId: string): Promise<MovementDto[]> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/Movements/by-user/${userId}`);
    return handleResponse<MovementDto[]>(response);
};

/**
 * Registers a new checkout movement.
 * Corresponds to: POST /api/v1/Movements/checkout
 */
export const createCheckoutMovement = async (movementData: RegisterMovementRequestDto): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/Movements/checkout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(movementData),
    });
    return handleResponse<any>(response);
};

/**
 * Registers a new checkin movement.
 * Corresponds to: POST /api/v1/Movements/checkin
 */
export const createCheckinMovement = async (movementData: RegisterMovementRequestDto): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/Movements/checkin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(movementData),
    });
    return handleResponse<any>(response);
};

/**
 * Updates the profile of the currently authenticated user.
 * Corresponds to: PUT /api/v1/Users/me
 */
export const updateCurrentUserProfile = async (profileData: UpdateProfileRequestDto): Promise<UserDto> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/Users/me`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
    });
    return handleResponse<UserDto>(response);
};

/**
 * Changes the password for the currently authenticated user.
 * Corresponds to: POST /api/v1/Users/me/change-password
 */
export const changeCurrentUserPassword = async (passwordData: ChangePasswordRequestDto): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/Users/me/change-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordData),
    });
    await handleResponse<void>(response);
};