import apiClient from "./axios";

// Get current authenticated user
export async function getCurrentUser() {
    const response = await apiClient.get("/me/");
    return response.data;
}

export async function getAllUsers() {
    const response = await apiClient.get("/users/");
    return response.data;
}

export async function getSpecificUser(id) {
    const response = await apiClient.get("/users/${id}/");
    return response.data;
}

export async function createUser(payload) {
    const response = await apiClient.post("/users/", payload);
    return response.data;
}

export async function updateSpecificUser(id, payload) {
    const response = await apiClient.patch(`/users/${id}/`, payload);
    return response.data;
}

export async function deleteUser(id) {
    const response = await apiClient.delete(`/users/${id}/`);
    return response.data;
}