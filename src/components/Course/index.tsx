import { formatNumber } from "@/helpers";
import CustomImage from "../_commons/CustomImage";
import I18n from "../_commons/I18n";
import SvgIcon from "../_commons/SvgIcon";
import { Tooltip } from "antd";

const item = {
  name: "What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing ",
  description:
    "What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 196",

  thumnail: "/images/course.jpg",
  rating: 4.7,
  review: 200000,
  time: 10,
};

type CourseProps = {
  onView?: () => void;
};

export const CourseItem: React.FC<CourseProps> = (props) => {
  return (
    <div
      className="border border-stroke rounded-lg p-3 hover:shadow-default cursor-pointer"
      onClick={() => props?.onView?.()}
    >
      <div className="h-[170px] w-0 px-[50%] relative">
        <CustomImage
          src={item.thumnail}
          alt="Course Thumbnail"
          width={300}
          height={150}
          className="rounded-lg w-[100%] h-[100%] absolute left-0 top-0"
        ></CustomImage>
      </div>
      <div className="line-clamp-2 text-title-xsm font-semibold my-2">
        <Tooltip title={<div className="max-w-[300px]">{item.name}</div>}>
          {item.name}
        </Tooltip>
      </div>
      <div className="line-clamp-1">{item.description}</div>
      <div className="my-2 flex items-center">
        <div className="flex items-center space-x-1">
          <div className="">
            <SvgIcon
              icon="star"
              className="fill-system text-system icon icon-sm"
            ></SvgIcon>
          </div>
          <div className="">{item.rating}</div>
          <div className="text-secondary">
            ({formatNumber(item.review)} <I18n i18key="reviews"></I18n>)
          </div>
        </div>
        <div className="ml-auto">{item.time}h</div>
      </div>
    </div>
  );
};
