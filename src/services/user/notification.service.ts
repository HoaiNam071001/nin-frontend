// Giả định các model
import {
  NotificationModel,
  NotificationPayload,
} from "@/models/user/notification.model";
import { List2Res, PageAble, stringifyPageAble } from "@/models/utils.model";
import apiClient from "../config"; // Giả định đường dẫn đến apiClient

export const notificationsService = {
  // Lấy danh sách thông báo theo userId với phân trang
  find: async (paging: PageAble): Promise<List2Res<NotificationModel>> => {
    const params = `${stringifyPageAble(paging)}`;
    const response = await apiClient.get<List2Res<NotificationModel>>(
      `/notifications?${params}`
    );
    return response.data;
  },

  // Lấy thông báo theo ID
  findOne: async (id: number): Promise<NotificationModel> => {
    const response = await apiClient.get<NotificationModel>(
      `/notifications/${id}`
    );
    return response.data;
  },

  countUnRead: async (): Promise<number> => {
    const response = await apiClient.get<number>(`/notifications/count`);
    return response.data;
  },

  // Cập nhật thông báo
  update: async (
    id: number,
    payload: NotificationPayload
  ): Promise<NotificationModel> => {
    const response = await apiClient.put<NotificationModel>(
      `/notifications/${id}`,
      payload
    );
    return response.data;
  },

  readAll: async (): Promise<NotificationModel> => {
    const response = await apiClient.put<NotificationModel>(`/notifications`);
    return response.data;
  },

  // Xóa thông báo
  remove: async (id: number): Promise<void> => {
    await apiClient.delete(`/notifications/${id}`);
  },
};
