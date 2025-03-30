// models/course/section-progress.model.ts

import { User } from "../user/user.model";
import { SectionCourse } from "./section.model";

export interface SectionProgress {
  id: number;
  user: User;
  section: SectionCourse;
  completed: boolean;
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateSectionProgressPayload {
  completed?: boolean;
  progress?: number;
}
