import apiClient from "./axios";

/**
 * ============================
 * MENU API HELPER
 * ============================
 * This file defines all CRUD operations for the MenuItem model.
 * Django REST Framework auto-generates these endpoints via router.register('menu', MenuItemViewSet)
 *
 * Base URL (from axios.js): http://127.0.0.1:8000/api/
 * Therefore all requests here target:
 *    - GET /api/menu/
 *    - GET /api/menu/:id/
 *    - POST /api/menu/
 *    - PATCH /api/menu/:id/
 *    - DELETE /api/menu/:id/
 */


export async function getAllMenuItems() {
    const response = await apiClient.get("/menu/");
    return response.data;
}

export async function getMenuItem(id) {
    const response = await apiClient.get("/menu/${id}/");
    return response.data;
}

export async function createMenuItem(payload) {
    // Check if payload contains a file (for image upload)
    if (payload.image_file instanceof File) {
        const formData = new FormData();
        
        // Append all fields to FormData
        Object.keys(payload).forEach(key => {
            if (key === 'image_file') {
                formData.append('image_url', payload[key]); // Backend expects 'image_url' field
            } else if (key === 'tag_ids' && Array.isArray(payload[key])) {
                // Handle array of tag IDs - append each individually
                payload[key].forEach(tagId => {
                    formData.append('tag_ids', tagId);
                });
            } else if (payload[key] !== null && payload[key] !== undefined) {
                formData.append(key, payload[key]);
            }
        });
        
        const response = await apiClient.post("/menu/", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }
    
    // Regular JSON payload if no file
    const response = await apiClient.post("/menu/", payload);
    return response.data;
}

export async function updateMenuItem(id, payload) {
    // Check if payload contains a file (for image upload)
    if (payload.image_file instanceof File) {
        const formData = new FormData();
        
        // Append all fields to FormData
        Object.keys(payload).forEach(key => {
            if (key === 'image_file') {
                formData.append('image_url', payload[key]); // Backend expects 'image_url' field
            } else if (key === 'tag_ids' && Array.isArray(payload[key])) {
                // Handle array of tag IDs - append each individually
                payload[key].forEach(tagId => {
                    formData.append('tag_ids', tagId);
                });
            } else if (payload[key] !== null && payload[key] !== undefined) {
                formData.append(key, payload[key]);
            }
        });
        
        const response = await apiClient.patch(`/menu/${id}/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }
    
    // Regular JSON payload if no file
    const response = await apiClient.patch(`/menu/${id}/`, payload);
    return response.data;
}

export async function deleteMenuItem(id) {
    const response = await apiClient.delete(`/menu/${id}/`);
    return response.data;
}