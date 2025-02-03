"use client";

import { formatNumber } from "@/helpers";
import CustomImage from "../_commons/CustomImage";
import NButton from "../_commons/NButton";
import SvgIcon from "../_commons/SvgIcon";
import { DEFAULT_COURSE_THUMBNAIL } from "@/constants/consts/course";

const item = {
  name: "What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing ",
  description:
    "What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 196",

  thumnail: DEFAULT_COURSE_THUMBNAIL,
  price: 10000,
  originPrice: 20000,
};

export const CourseCard = () => {
  return (
    <div className="border border-stroke rounded-md p-3 hover:shadow-default cursor-pointer space-y-4 w-full">
      <div className="h-[170px] w-0 px-[50%] relative">
        <CustomImage
          src={item.thumnail}
          alt="Course Thumbnail"
          width={300}
          height={150}
          className="rounded-md w-[100%] h-[100%] absolute left-0 top-0"
        ></CustomImage>
      </div>

      <div>
        <span className="text-title-md leading-[1rem] font-semibold">
          ${formatNumber(item.price)}
        </span>
        <span className="size-2 line-through text-gray-500">
          ${formatNumber(item.originPrice)}
        </span>
      </div>
      <div className="flex space-x-2">
        <NButton size="lg" className="flex-1">
          Buy Now
        </NButton>
        <NButton
          variant="outlined"
          size="lg-circle"
          className=""
        >
          <SvgIcon icon="cart" className="icon icon-md text-system"></SvgIcon>
        </NButton>

        <NButton
          color="secondary"
          size="lg-circle"
          className=""
        >
          <SvgIcon icon="bookmark" className="icon icon-md"></SvgIcon>
        </NButton>
      </div>

      <div className="border-t border-t-stroke pt-2 space-y-2">
        <div className="font-semibold">This course includes</div>
        <div className="text-gray-500">
          <div>{ 40 } <span>downloadable resources</span></div>
          <div>{ 20 } <span>sections</span></div>
          <div>{ 30 } <span> hours on-demand video</span></div>
        </div>
      </div>
    </div>
  );
};
