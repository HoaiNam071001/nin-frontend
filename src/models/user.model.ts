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
}

export interface UserRole {
  id: number;
  roleName: Role;
}

export interface RoleRequest {
  role: Role;
}