import { Course } from "./course.model";

export interface SettingSubmitProps {
  course?: Course;
  setCourse?: (course: Course) => void;
  moveToNextStep?: () => void;
  moveToPrevStep?: () => void;
  cancel?: () => void;
}
