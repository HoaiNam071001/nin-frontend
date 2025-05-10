import { User } from "../user/user.model";
import { Course } from "./course.model";

export class CourseProgress {
  id: number;
  userId: number;
  courseId: number;
  progress: number;
  createdAt: string;
  updatedAt: string;
  user: User;
  course: Course;
}
