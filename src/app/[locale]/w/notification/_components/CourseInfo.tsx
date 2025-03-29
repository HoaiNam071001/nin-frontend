import { CourseItem } from "@/components/CourseItem";
import { Course } from "@/models";

interface CourseInfoProps {
  course: Course;
  viewDetail?: boolean;
  viewLecture?: boolean;
  viewSetting?: boolean;
}

const CourseInfo: React.FC<CourseInfoProps> = ({
  course,
  viewDetail = false,
  viewLecture = false,
  viewSetting = false,
}) => {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Course Information
      </h3>
      {course ? (
        <div className="w-[400px] mx-auto">
          <CourseItem
            key={course.id}
            course={course}
            viewDetail={viewDetail}
            viewLecture={viewLecture}
            viewSetting={viewSetting}
          />
        </div>
      ) : (
        <p className="text-gray-500">No course information available.</p>
      )}
    </div>
  );
};

export default CourseInfo;
