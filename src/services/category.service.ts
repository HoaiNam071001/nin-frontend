import { Category } from "@/models";
import apiClient from "./config";
import { List2Res, PageAble, stringifyPageAble } from "@/models/utils.model";

export const categoryService = {
  getRoot: async (pageAble?: PageAble) => {
    const response = await apiClient.get<List2Res<Category>>(
      `/category?${stringifyPageAble(pageAble)}`
    );
    return response.data;
  },
  getChildren: async (parentId: number, pageable?: PageAble) => {
    const response = await apiClient.get<List2Res<Category>>(
      `/category/${parentId}?${stringifyPageAble(pageable)}`
    );
    return response.data;
  },

  getAllParent: async () => {
    const response = await apiClient.get<Category[]>(
      `/category/all`
    );
    return response.data;
  },

  getAllChildren: async (parentId: number) => {
    const response = await apiClient.get<Category[]>(
      `/category/all/${parentId}`
    );
    return response.data;
  },
};
