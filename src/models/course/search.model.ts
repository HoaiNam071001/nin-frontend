import { CourseStatus } from "@/constants";

export interface CourseSearchPayload {
  status: CourseStatus[];
  levelIds?: number[];
  categoryIds?: number[];
}
