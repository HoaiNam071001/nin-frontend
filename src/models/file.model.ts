export interface UploadFilePayload {
  file: File;
  type: SystemFileType;
}

export interface NFile {
  id: number;
  name: string;
  url: string;
  type: string; // ví dụ 'image/png', 'application/pdf', v.v.
  size: number; // Kích thước file tính bằng byte
  deleted: boolean;
  systemType: SystemFileType,
  createdAt: string; // Thời gian tạo (ISO string)
  updatedAt: string; // Thời gian cập nhật (ISO string)
}

export enum SystemFileType {
  COURSE_INFO = 'course_info',
  COURSE_CONTENT = 'course_content',
  VIDEO_CONTENT = 'video_content',
  PROFILE = 'profile',
  OTHER = 'other',
}
