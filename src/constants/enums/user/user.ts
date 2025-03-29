import { DropdownOption } from "@/models/utils.model";

export enum Role {
  STUDENT = "student",
  TEACHER = "teacher",
  EDUCATION_MANAGER = "education-manager",
  ADMIN = "admin",
}

export const RoleBackgrounds = {
  [Role.STUDENT]: 'bg-blue-500',
  [Role.TEACHER]: 'bg-green-500', 
  [Role.EDUCATION_MANAGER]: 'bg-purple-500',
  [Role.ADMIN]: 'bg-red'
};

export const RoleLabels = {
  [Role.STUDENT]: 'Student',
  [Role.TEACHER]: 'Lecturer', 
  [Role.EDUCATION_MANAGER]: 'Manager',
  [Role.ADMIN]: 'Admin'
};

export const RoleOptions: DropdownOption<Role>[] = Object.keys(Role).map((key) => ({
  value: Role[key as keyof typeof Role],
  name: RoleLabels[Role[key as keyof typeof Role]],
  background: RoleBackgrounds[Role[key as keyof typeof Role]],
}));