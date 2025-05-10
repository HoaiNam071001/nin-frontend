import { Role } from "@/constants";

export interface CreateUserPayload {
  email?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  phoneNumber?: string;
  birthDay?: string;
  bio?: string;
  password?: string;
  roles?: Role[];
}

export interface UpdateUserPayload {
  email?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  phoneNumber?: string;
  birthDay?: string;
  bio?: string;
  roles?: Role[];
  password?: string;
}

export interface DashboardUserFile {
  size: number;
  count: number;
  user: {
    id: number;
    fullName: string;
    email: string;
    avatar: string;
  };
}
