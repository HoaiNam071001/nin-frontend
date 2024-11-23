import { AuthCreateUserPayload, AuthUserPayload, AuthUserResponse } from "@/models/auth.model";
import apiClient from "./_config";

export const authService = {
  signup: async (data: AuthCreateUserPayload) => {
    const response = await apiClient.post<AuthUserResponse>("auth/signup", data);
    return response.data;
  },

  signin: async (data: AuthUserPayload): Promise<AuthUserResponse> => {
    const response = await apiClient.post<AuthUserResponse>("auth/signin", data);
    return response.data;
  },
};
