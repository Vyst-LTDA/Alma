/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
import { CreateItemRequestDto, ItemDto, PagedResult } from '../types';

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
