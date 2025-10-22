import apiClient from "./axios";

/**
 * ============================
 * TAG API HELPER
 * ============================
 * This file defines all operations for the Tag model.
 * 
 * Tags categorize menu items based on:
 * - Time of Day (Breakfast, Lunch, Dinner, All-Day)
 * - Temperature (Hot, Cold, Frozen)
 * - Meal Type (Main Course, Appetizer, Dessert, Beverage, Snack)
 */

export async function getAllTags() {
    const response = await apiClient.get("/tags/");
    return response.data;
}

export async function getTagsByType(tagType) {
    const response = await apiClient.get(`/tags/?tag_type=${tagType}`);
    return response.data;
}

export async function createTag(payload) {
    const response = await apiClient.post("/tags/", payload);
    return response.data;
}

export async function updateTag(id, payload) {
    const response = await apiClient.patch(`/tags/${id}/`, payload);
    return response.data;
}

export async function deleteTag(id) {
    const response = await apiClient.delete(`/tags/${id}/`);
    return response.data;
}
