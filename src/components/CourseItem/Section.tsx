import { DEFAULT_COURSE_THUMBNAIL } from "@/constants";
import { SectionProgress } from "@/models/course/section-progress.model";
import { SectionType } from "@/models/course/section.model";
import { Tooltip } from "antd";
import CustomImage from "../_commons/CustomImage";
import HMSDisplay, { HMSDisplayMode } from "../_commons/HMSDisplay";
import SvgIcon from "../_commons/SvgIcon";

type ProgressSectionProps = {
  item: SectionProgress;
  onView?: () => void;
};

export const ProgressSection: React.FC<ProgressSectionProps> = ({
  item,
  onView,
}) => {
  return (
    <div
      className="border-[0.5px] border-stroke rounded-lg hover:shadow-lg shadow cursor-pointer flex overflow-hidden"
      onClick={() => onView?.()}
    >
      <div className="relative h-[120px] w-[80px] flex items-center justify-center border-r-[0.5px] border-stroke bg-slate-100">
        <SvgIcon
          icon={item.section.type === SectionType.Post ? "file" : "video-file"}
          className="icon icon-xl"
        ></SvgIcon>

        <CustomImage
          src={item.section.course.thumbnail || DEFAULT_COURSE_THUMBNAIL}
          alt="preview"
          className="absolute top-0 left-0 z-1 w-full h-full opacity-10"
        />
      </div>
      <div className="p-3 relative flex-1 h-full overflow-hidden">
        <div className="line-clamp-1 ">{item.section?.course?.name}</div>
        <div className="line-clamp-2 text-title-xsm font-semibold">
          <Tooltip
            title={<div className="max-w-[300px]">{item.section?.name}</div>}
          >
            {item.section?.name}
          </Tooltip>
        </div>
        <div className="mt-auto">
          <HMSDisplay
            seconds={item.section.estimatedTime}
            mode={HMSDisplayMode.short}
          />
        </div>
      </div>
    </div>
  );
};
