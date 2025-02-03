import { CourseStatus } from "@/constants";
import { User } from "../user.model";

export interface Level {
  id: number;
  name: string;
}

export interface Topic {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
  parent?: Category;
}

export interface CoursePayload {
  name: string;
  thumbnail?: string;
  description?: string;
  price?: number;
  summary?: string;
  estimatedTime?: number;
  status?: CourseStatus;
  categoryId?: number;
  subCategoryId?: number;
  levelId?: number;
  topicIds?: number[];
}

export interface Course {
  id: number;
  name: string;
  slug?: string;
  thumbnail?: string;
  description?: string;
  price?: number;
  estimatedTime?: number;
  status: CourseStatus;
  owner: User;
  category?: Category;
  subCategory?: Category;
  level?: Level;
  topics?: Topic[];
  summary?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CourseFile {
  name: string;
  size: number;
  time: string;
  url: string;
  type: CourseFileType;
};

export enum StepType {
  Target,
  OverView,
  Content,
  RolePermission,
  Payment,
}

export interface CourseStepItem {
  label: string;
  icon: string;
  type: StepType;
}

export const CourseSteps: CourseStepItem[] = [
  {
    label: "Target",
    icon: "over",
    type: StepType.Target,
  },
  {
    label: "OverView",
    icon: "over",
    type: StepType.OverView,
  },
  {
    label: "Content",
    icon: "over",
    type: StepType.Content,
  },
  {
    label: "Role & Permission",
    icon: "over",
    type: StepType.RolePermission,
  },
  {
    label: "Payment",
    icon: "over",
    type: StepType.Payment,
  },
];

export enum CourseFileType {
  VIDEO = "video",
  FILE = "file",
}

export enum CourseTargetType {
  object= 'object',
  requirement = 'requirement',
  achieved = 'achieved',
}

export interface CourseTarget {
  id?: number;
  content: string;
  type: CourseTargetType;
  createdAt?: string;
  updatedAt?: string;
}

export interface CourseTargetPayload {
  payload: CourseTarget[];
}

export interface CourseStatusPayload {
  status?: CourseStatus;
}
