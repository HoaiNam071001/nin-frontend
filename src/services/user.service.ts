import { RoleRequest, User } from "@/models";
import apiClient from "./config";

export const userService = {
  getProfile: async () => {
    const response = await apiClient.get<User>(`/users/profile`);
    return response.data;
  },

  getUserById: async (id: string) => {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data;
  },

  addMyRole: async (request: RoleRequest) => {
    const response = await apiClient.post<User>(`/users/roles`, request);
    return response.data;
  }

  // updateUser: async (id: string, data: { name?: string; email?: string }) => {
  //   const response = await apiClient.put(`/users/${id}`, data);
  //   return response;
  // },
};

