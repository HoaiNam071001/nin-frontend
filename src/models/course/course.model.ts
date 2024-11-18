export interface Course {
  id: string; // ID duy nhất của khóa học
  title: string; // Tiêu đề của khóa học
  description: string; // Mô tả chi tiết về khóa học
  createdAt: string; // Thời gian tạo khóa học
  updatedAt: string; // Thời gian cập nhật khóa học
}

export interface CourseFile {
  name: string;
  size: number;
  time: string;
  url: string;
  type: CourseFileType;
};

export interface CourseSectionItem {
  name: string;
  description: string;
  children: CourseSectionItem[];
  files: CourseFile[];
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
