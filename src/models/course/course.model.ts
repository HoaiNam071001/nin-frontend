export interface Course {
  id: string; // ID duy nhất của khóa học
  title: string; // Tiêu đề của khóa học
  description: string; // Mô tả chi tiết về khóa học
  createdAt: string; // Thời gian tạo khóa học
  updatedAt: string; // Thời gian cập nhật khóa học
}

export enum StepType {
  Target,
  OverView,
  Content,
  RolePermission,
  Payment,
}

export const CourseSteps = [
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
