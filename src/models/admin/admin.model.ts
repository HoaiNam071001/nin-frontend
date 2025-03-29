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
}