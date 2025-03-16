import { Role, StorageKey, UserLocalStorage } from "@/constants";
import { AuthUserResponse, User } from "@/models";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string;
  isAuthenticated: boolean;
  user: User;
  activeRole: Role;
}

const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
  user: null,
  activeRole: Role.STUDENT,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<AuthUserResponse>) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      const roles = action.payload.user.roles;

      const roleKey = UserLocalStorage.getByUser({
        key: StorageKey.ACTIVE_ROLE,
        user: action.payload.user,
      });
      const role = localStorage.getItem(roleKey) as Role;
      state.activeRole = roles[0]?.roleName || Role.STUDENT;

      if (Object.values(Role).includes(role)) {
        state.activeRole = role;
      }
      localStorage.setItem(roleKey, state.activeRole);
      localStorage.setItem(StorageKey.AUTH_TOKEN, action.payload.token);
    },
    logout: (state) => {
      if (state.user) {
        localStorage.removeItem(
          UserLocalStorage.getByUser({
            key: StorageKey.ACTIVE_ROLE,
            user: state.user,
          })
        );
      }
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
      state.user = {
        ...state.user,
        ...action.payload
      };
    },
    setRole: (state) => {
      const roleKey = UserLocalStorage.getByUser({
        key: StorageKey.ACTIVE_ROLE,
        user: state.user,
      });
      const role = localStorage.getItem(roleKey) as Role;

      state.activeRole = Object.values(Role).includes(role)
        ? role
        : Role.STUDENT;
    },
    switchRole: (state, action: PayloadAction<Role>) => {
      state.activeRole = action.payload || Role.STUDENT;
      const roleKey = UserLocalStorage.getByUser({
        key: StorageKey.ACTIVE_ROLE,
        user: state.user,
      });

      localStorage.setItem(roleKey, state.activeRole);
    },
  },
});

// export const { login, logout, loadTokenFromStorage, setUser } = authSlice.actions;
export const authAction = { ...authSlice.actions };

export default authSlice.reducer;
