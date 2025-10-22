import apiClient from "./axios";



export async function getAllPayments() {
    const response = await apiClient.get("/payment/");
    return response.data;
}

export async function getSpecificPayment(id) {
    const response = await apiClient.get("/payment/${id}/");
    return response.data;
}

export async function createPayment(payload) {
    const response = await apiClient.post("/payment/", payload);
    return response.data;
}

export async function updatePaymentItem(id, payload) {
    const response = await apiClient.patch(`/payment/${id}/`, payload);
    return response.data;
}

export async function deletePaymentItem(id) {
    const response = await apiClient.delete(`/payment/${id}/`);
    return response.data;
}