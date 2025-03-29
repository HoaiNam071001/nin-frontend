import {
  RoleRequest,
  ShortUser,
  User,
  UserPayload,
  UserSearchPayload,
} from "@/models";
import apiClient from "../config";
import { List2Res, PageAble, stringifyPageAble } from "@/models/utils.model";
import queryString from "query-string";
import {
  CreateUserPayload,
  UpdateUserPayload,
} from "@/models/admin/admin.model";

export const adminService = {
  getUsers: async (pageAble: PageAble) => {
    const params = `${stringifyPageAble(pageAble)}`;
    const response = await apiClient.get<List2Res<User>>(
      `/dashboard/users?${params}`
    );
    return response.data;
  },

  updateUser: async (id: number, payload: UpdateUserPayload) => {
    const response = await apiClient.put<User>(
      `/dashboard/user/${id}`,
      payload
    );
    return response.data;
  },

  createUser: async (payload: CreateUserPayload) => {
    const response = await apiClient.post<User>(`/dashboard/user`, payload);
    return response.data;
  },

  switchUserStatus: async (id: number, active: boolean) => {
    const response = await apiClient.put<User>(`/dashboard/user/status/${id}`, {
      active,
    });
    return response.data;
  },
};
