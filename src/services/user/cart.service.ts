// src/services/cartService.ts (hoặc vị trí phù hợp trong dự án frontend của bạn)
import { CartItem } from "@/models/user/cart.model";
import apiClient from "../config"; // Đường dẫn đến cấu hình apiClient của bạn

export const cartService = {
  addItem: async (courseId: number) => {
    const response = await apiClient.post<CartItem>(`/cart/items/${courseId}`);
    return response.data;
  },

  getCartItems: async () => {
    const response = await apiClient.get<CartItem[]>(`/cart/items`);
    return response.data;
  },

  removeItem: async (recordId: number) => {
    await apiClient.delete(`/cart/items/${recordId}`);
  },

  updateQuantity: async (itemId: number, quantity: number) => {
    const response = await apiClient.put<CartItem>(
      `/cart/items/${itemId}/quantity`,
      { quantity }
    );
    return response.data;
  },

  clearCart: async () => {
    await apiClient.delete(`/cart/clear`);
  },
};