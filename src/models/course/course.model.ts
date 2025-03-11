import { CourseStatus } from "@/constants";
import { ShortUser, User } from "../user/user.model";
import { DropdownOption } from "../utils.model";

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
  name?: string;
  thumbnail?: string;
  description?: string;
  price?: number;
  summary?: string;
  estimatedTime?: number;
  status?: CourseStatus[];
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
  currency?: string;
  level?: Level;
  topics?: Topic[];
  discounts?: Discount[];
  summary?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FullCourse {
  id: number;
  name: string;
  slug: string;
  thumbnail: string;
  description: string;
  summary: string;
  price: number;
  currency?: string;
  estimatedTime: number;
  status: CourseStatus;
  owner: ShortUser;
  category: Category;
  subCategory: Category;
  level: Level;
  topics: Topic[];
  instructors: Instructor[];
  discounts: Discount[];
  totalSection: number;
  totalFile: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseFile {
  name: string;
  size: number;
  time: string;
  url: string;
  type: CourseFileType;
}

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
  object = "object",
  requirement = "requirement",
  achieved = "achieved",
}

export enum CourseAccessType {
  VIEW = "view",
  EDIT = "edit",
}

export const CourseAccess: DropdownOption<CourseAccessType>[] = [
  {
    name: "View",
    value: CourseAccessType.VIEW,
  },
  {
    name: "Edit",
    value: CourseAccessType.EDIT,
  },
];

export enum InstructorType {
  PRIMARY = "primary",
  CO_INSTRUCTOR = "co-instructor",
  ASSISTANT = "assistant",
  CONTENT_CREATOR = "content_creator",
}

export const InstructorTypes: DropdownOption<InstructorType>[] = [
  {
    name: "Primary Instructor",
    value: InstructorType.PRIMARY,
  },
  {
    name: "Co-Instructor",
    value: InstructorType.CO_INSTRUCTOR,
  },
  {
    name: "Assistant Instructor",
    value: InstructorType.ASSISTANT,
  },
  {
    name: "Content Creator",
    value: InstructorType.CONTENT_CREATOR,
  },
];

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

export class Instructor {
  id: number;
  user: ShortUser;
  accessType: CourseAccessType;
  type: InstructorType;
  createdAt: Date;
  updatedAt: Date;
}

export class InstructorPayload {
  userId: number;
  accessType: CourseAccessType;
  type: InstructorType;
}

export interface DiscountPayload {
  courseId: number;
  amount?: number;
  discountType: DiscountType;
  startDate: string;
  endDate: string;
  discountCode?: string;
  description?: string;
}

export interface Discount extends DiscountPayload {
  id: number;
}
export enum DiscountType {
  PERCENT = "percent",
  AMOUNT = "amount",
}