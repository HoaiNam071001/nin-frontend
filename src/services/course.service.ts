import apiClient from './_config';

export const courseService = {
  getUsers: async () => {
    const response = await apiClient.get('/users');
    return response.data;
  },

  getUserById: async (id: string) => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  createUser: async (data: { name: string; email: string }) => {
    const response = await apiClient.post('/users', data);
    return response.data;
  },

  updateUser: async (id: string, data: { name?: string; email?: string }) => {
    const response = await apiClient.put(`/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: string) => {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  },
};
