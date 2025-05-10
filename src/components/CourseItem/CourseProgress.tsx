import { DEFAULT_COURSE_THUMBNAIL } from "@/constants";
import { CourseProgress } from "@/models";
import CustomImage from "../_commons/CustomImage";
import NAvatar from "../_commons/NAvatar";
import ProgressCircle from "../_commons/ProgressCircle";

type ProgressProps = {
  item: CourseProgress;
  onView?: () => void;
};

export const CourseProgressItem: React.FC<ProgressProps> = ({
  item,
  onView,
}) => {
  return (
    <div
      className="border-[0.5px] border-stroke rounded-lg hover:shadow-lg shadow cursor-pointer overflow-hidden"
      onClick={() => onView?.()}
    >
      <div className="h-[120px] w-0 px-[50%] relative border-b-[0.5px] border-stroke">
        <CustomImage
          src={item.course?.thumbnail || DEFAULT_COURSE_THUMBNAIL}
          alt="Course Thumbnail"
          width={300}
          height={150}
          className="w-[100%] h-[100%] absolute left-0 top-0"
        ></CustomImage>
        <div className="absolute top-1 right-1 rounded-full bg-white flex">
          <ProgressCircle
            percentage={item.progress}
            size={70}
            fontSize={16}
            strokeWidth={6}
          />
        </div>
      </div>
      <div className="p-3 relative flex-1 h-full overflow-hidden">
        {item.course?.owner && (
          <div>
            <NAvatar
              src={item.course.owner.avatar}
              name={item.course.owner.fullName}
              showName={true}
            />
          </div>
        )}
        <div className="line-clamp-2 font-semibold">{item?.course?.name}</div>
        <div className="text-ellipsis">{item.course?.summary}</div>
      </div>
    </div>
  );
};
