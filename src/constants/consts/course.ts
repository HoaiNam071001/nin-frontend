import { DropdownOption } from "@/models/utils.model";
import { CourseStatus } from "../enums";

export const COURSE_STATUS_OPTIONS: DropdownOption<CourseStatus>[] = Object.entries(CourseStatus).map(
  ([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase(), // Format lại key để hiển thị đẹp
    value,
  })
);


export const DEFAULT_COURSE_THUMBNAIL = '/images/course-2.png';