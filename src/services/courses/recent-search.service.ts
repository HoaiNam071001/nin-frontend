import {
  RecentSearch,
  RecentSearchPayload,
} from "@/models/course/recent-search.model";
import apiClient from "../config";

export const recentSearchService = {
  create: async (data: RecentSearchPayload): Promise<RecentSearch> => {
    const response = await apiClient.post<RecentSearch>(
      "/recent-searches",
      data
    );
    return response.data;
  },

  getRecentByUserId: async (): Promise<RecentSearch[]> => {
    const response = await apiClient.get<RecentSearch[]>(
      `/recent-searches`
    );
    return response.data;
  },

  remove: async (id: number): Promise<void> => {
    await apiClient.delete(`/recent-searches/${id}`);
  },
};
