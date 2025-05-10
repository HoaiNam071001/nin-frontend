import { Course } from "./course";
import { ShortUser } from "./user/user.model";

export interface UploadFilePayload {
  file: File;
  type: SystemFileType;
  courseId?: number;
}

export interface NFile {
  id: number;
  name: string;
  url: string;
  type: string; // ví dụ 'image/png', 'application/pdf', v.v.
  size: number; // Kích thước file tính bằng byte
  deleted: boolean;
  systemType: SystemFileType;
  createdAt: string; // Thời gian tạo (ISO string)
  updatedAt: string; // Thời gian cập nhật (ISO string)
  course?: Course;
  user?: ShortUser;
}

export enum SystemFileType {
  COURSE_INFO = "course_info",
  COURSE_CONTENT = "course_content",
  VIDEO_CONTENT = "video_content",
  PROFILE = "profile",
  OTHER = "other",
}

export class FileSearchPayload {
  userIds?: number[];
  courseIds?: number[];
}
