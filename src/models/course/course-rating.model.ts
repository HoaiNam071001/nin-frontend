import { User } from "../user/user.model";
import { Course } from "./course.model";

// Các model liên quan (đặt trong thư mục models/course/)
export interface CourseRating {
    id: number;
    userId: number;
    courseId: number;
    rating: number;
    content?: string;
    createdAt: string;
    updatedAt: string;
    user?: User;
    course?: Course;
  }
  
  export interface CreateCourseRatingDto {
    rating: number;
    content?: string;
  }
  
  export interface UpdateCourseRatingDto {
    rating?: number;
    content?: string;
  }

  export interface RatingStats {
    averageRating: number;
    ratingCounts: { [key: number]: number };
    ratingPercentages: { [key: number]: number };
    totalRatings: number;
  }