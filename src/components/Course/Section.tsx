import { formatNumber } from "@/utils/formatNumber";
import I18n from "../_commons/I18n";
import SvgIcon from "../_commons/SvgIcon";
import Progress from "antd/es/progress";
import { Tooltip } from "antd";

const item = {
  name: "1. Lorem Ipsum is simply dummy text of the printing ",
  description:
    "What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 196",
  course: {
    name: "What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing ",
    description:
      "What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 196",
    rating: 4.7,
    review: 200000,
    time: 10,
  },
  time: 100,
  progress: 30,
};

type ProgressSectionProps = {
  onView?: () => void;
};

export const ProgressSection: React.FC<ProgressSectionProps> = (props) => {
  return (
    <div
      className="border border-stroke rounded-lg p-3 hover:shadow-default cursor-pointer flex"
      onClick={() => props?.onView?.()}
    >
      <div className="grid-1 h-full mr-3 min-w-[80px] flex items-center justify-center border rounded-md border-stroke hover:bg-[rgba(0,0,0,0.25)] relative">
        <div className="bg-white w-[45px] h-[45px] rounded-full"></div>
        <SvgIcon
          icon="caret-arrow"
          className="fill-black icon icon-md z-1 absolute left-[29px]"
        ></SvgIcon>
      </div>
      <div>
        <div className="line-clamp-1">{item.course.name}</div>
        <div className="line-clamp-2 text-title-xsm font-semibold">
          <Tooltip title={<div className="max-w-[300px]">{item.name}</div>}>
            {item.name}
          </Tooltip>
        </div>
        <div className="my-1 flex items-center">
          <div className="text-secondary">
            {formatNumber(item.time - item.progress)}m{" "}
            <I18n i18key="left"></I18n>
          </div>

          <Progress
            type="circle"
            className="ml-auto"
            percent={75}
            size={50}
            strokeWidth={10}
          />
        </div>
      </div>
    </div>
  );
};
