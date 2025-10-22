import apiClient from "./axios";


export async function getAllNotifications() {
    const response = await apiClient.get("/notification/");
    return response.data;
}

export async function getNotificationItem(id) {
    const response = await apiClient.get("/notification/${id}/");
    return response.data;
}

export async function createNotificationItem(payload) {
    const response = await apiClient.post("/notification/", payload);
    return response.data;
}

export async function updateNotificationItem(id, payload) {
    const response = await apiClient.patch(`/notification/${id}/`, payload);
    return response.data;
}

export async function deleteNotificationItem(id) {
    const response = await apiClient.delete(`/notification/${id}/`);
    return response.data;
}