import { ROUTES } from "@/constants";
import { DEFAULT_COURSE_THUMBNAIL } from "@/constants/consts/course";
import { useI18nRouter } from "@/hooks/useI18nRouter";
import { Course } from "@/models";
import CustomImage from "../_commons/CustomImage";
import I18n from "../_commons/I18n";
import NAvatar from "../_commons/NAvatar";
import NTooltip from "../_commons/NTooltip";
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
          <Rating initialValue={course.rating} size="ssm" />
          <div className="font-semibold">{course.rating}</div>
          {course.level && (
            <div className="ml-auto bg-slate-100 text-slate-600 px-2 rounded-sm">
              <I18n i18key={course.level.name}></I18n>
            </div>
          )}
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
        <div className="overflow-hidden text-title-xsm font-semibold">
          <NTooltip title={<div className="text-ellipsis">{course?.name}</div>}>
            <div className="text-ellipsis">{course?.name}</div>
          </NTooltip>
        </div>
        <div className="line-clamp-2">{course?.summary}</div>
      </div>
    </div>
  );
};
