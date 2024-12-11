import { Level } from '@/models';
import apiClient from './config';

export const levelService = {
  get: async () => {
    const response = await apiClient.get<Level[]>(`/level`);
    return response.data;
  },
};
