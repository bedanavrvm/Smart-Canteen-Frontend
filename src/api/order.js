import apiClient from "./axios";

//Order
export async function getAllOrders() {
    const response = await apiClient.get("/order/");
    return response.data;
}

// Get all orders for staff (backend now automatically returns all orders for staff users)
export async function getAllOrdersForStaff() {
    const response = await apiClient.get("/order/");
    return response.data;
}

export async function getSpecificOrder(id) {
    const response = await apiClient.get(`/order/${id}/`);
    return response.data;
}

export async function createOrder(payload) {
    const response = await apiClient.post("/order/", payload);
    return response.data;
}

export async function updateOrder(id, payload) {
    const response = await apiClient.patch(`/order/${id}/`, payload);
    return response.data;
}


export async function deleteOrder(id) {
    const response = await apiClient.delete(`/order/${id}/`);
    return response.data;
}


//Order Item
export async function getAllOrderItems() {
    const response = await apiClient.get("/order-item/");
    return response.data;
}

export async function getOrderItem(id) {
    const response = await apiClient.get(`/order-item/${id}/`);
    return response.data;
}

export async function createOrderItem(payload) {
    const response = await apiClient.post("/order-item/", payload);
    return response.data;
}

export async function updateOrderItem(id, payload) {
    const response = await apiClient.patch(`/order-item/${id}/`, payload);
    return response.data;
}

export async function deleteOrderItem(id) {
    const response = await apiClient.delete(`/order-item/${id}/`);
    return response.data;
}