import { Course } from "./course.model";

export interface SettingSubmitProps {
  course?: Course;
  editable?: boolean;
  setCourse?: (course: Course) => void;
  moveToNextStep?: () => void;
  moveToPrevStep?: () => void;
  cancel?: () => void;
}
