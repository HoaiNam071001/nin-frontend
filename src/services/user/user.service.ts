import { RoleRequest, ShortUser, User, UserPayload, UserSearchPayload } from "@/models";
import apiClient from "../config";
import { List2Res, PageAble, stringifyPageAble } from "@/models/utils.model";
import queryString from "query-string";

export const userService = {
  getProfile: async () => {
    const response = await apiClient.get<User>(`/users/profile`);
    return response.data;
  },

  get: async (payload: UserSearchPayload, pageAble: PageAble) => {
    const params = `${stringifyPageAble(pageAble)}&${queryString.stringify(
      payload
    )}`;
    const response = await apiClient.get<List2Res<ShortUser>>(
      `/users/search?${params}`
    );
    return response.data;
  },

  getUserById: async (id: number) => {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data;
  },

  addMyRole: async (request: RoleRequest) => {
    const response = await apiClient.post<User>(`/users/roles`, request);
    return response.data;
  },

  updateUser: async (id: string, payload: UserPayload) => {
    const response = await apiClient.put<User>(`/users/${id}`, payload);
    return response.data;
  },
};
