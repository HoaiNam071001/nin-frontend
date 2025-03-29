import { Role } from "@/constants";

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatar: string;
  phoneNumber: string;
  birthDay: string;
  bio: string;
  roles: UserRole[];
  createAt: string;
  updatedAt: string;
  active: boolean;
}

export interface ShortUser {
  id: number;
  email: string;
  avatar: string;
  fullName: string;
}

export interface UserSearchPayload {

}

export interface UserRole {
  id: number;
  roleName: Role;
}

export interface RoleRequest {
  role: Role;
}

export interface UserPayload {
  email?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  phoneNumber?: string;
  birthDay?: string;
  bio?: string;
}