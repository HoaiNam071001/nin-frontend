import { StorageKey } from "@/constants";
import { AuthUserResponse, User } from "@/models";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string;
  isAuthenticated: boolean;
  user: User;
}

const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<AuthUserResponse>) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      localStorage.setItem(StorageKey.AUTH_TOKEN, action.payload.token);
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem(StorageKey.AUTH_TOKEN);
    },
    loadTokenFromStorage: (state) => {
      const token = localStorage.getItem(StorageKey.AUTH_TOKEN);
      if (token) {
        state.token = token;
        state.isAuthenticated = true;
      }
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },
});

// export const { login, logout, loadTokenFromStorage, setUser } = authSlice.actions;
export const authAction = { ...authSlice.actions };

export default authSlice.reducer;
