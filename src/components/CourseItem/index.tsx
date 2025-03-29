import { ROUTES } from "@/constants";
import { DEFAULT_COURSE_THUMBNAIL } from "@/constants/consts/course";
import { useI18nRouter } from "@/hooks/useI18nRouter";
import { Course } from "@/models";
import { Tooltip } from "antd";
import CustomImage from "../_commons/CustomImage";
import NAvatar from "../_commons/NAvatar";
import Rating from "../_commons/Rating";

type CourseProps = {
  course?: Course;
  viewDetail?: boolean;
  viewLecture?: boolean;
  viewSetting?: boolean;
};

export const CourseItem: React.FC<CourseProps> = ({
  course,
  viewDetail,
  viewLecture,
  viewSetting,
}) => {
  const router = useI18nRouter();

  const onView = () => {
    if (viewLecture) {
      router.push(ROUTES.COURSE_DETAIL(course.slug));
      return;
    }
    if (viewDetail) {
      router.push(`${ROUTES.COURSE}/${course.slug}`);
      return;
    }
    if (viewSetting) {
      router.push(`${ROUTES.INSTRUCTOR_COURSE}/${course.id}`);
      return;
    }
  };

  return (
    <div
      className="rounded-lg shadow-md hover:shadow-xl cursor-pointer overflow-hidden transition-all border-[0.5px] border-stroke"
      onClick={() => onView()}
    >
      <div className="h-[170px] w-0 px-[50%] relative border-b-[0.5px] border-stroke">
        <CustomImage
          src={course?.thumbnail || DEFAULT_COURSE_THUMBNAIL}
          alt="Course Thumbnail"
          width={300}
          height={150}
          className="w-[100%] h-[100%] absolute left-0 top-0"
        ></CustomImage>
      </div>

      <div className="p-3 space-y-2">
        <div className="flex items-center gap-2">
          <Rating initialValue={Math.round(course.rating)} size="sm" />
          <div className="font-semibold">{course.rating}</div>
        </div>
        {course.owner && (
          <div>
            <NAvatar
              src={course.owner.avatar}
              name={course.owner.fullName}
              showName={true}
            />
          </div>
        )}
        <div className="line-clamp-1 text-title-xsm font-semibold">
          <Tooltip title={<div className="max-w-[300px]">{course?.name}</div>}>
            {course?.name}
          </Tooltip>
        </div>
        <div className="line-clamp-2">{course?.summary}</div>
      </div>
    </div>
  );
};
