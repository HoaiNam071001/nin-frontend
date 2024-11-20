"use client";

import NAvatar from "../_commons/NAvatar";
import SvgIcon from "../_commons/SvgIcon";
import NButton from "../_commons/NButton";
import ExpandableContent from "../_commons/ExpandableContent";
const longContent = `
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.</p>
<p>Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris.</p>
<p>Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla.</p>
<p>Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</p>
<p>Curabitur sodales ligula in libero. Sed dignissim lacinia nunc.</p>
<p>Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor.</p>
<p>Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor.</p>
<p>Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa.</p>
`;
export const CourseBasicInfo = () => {
  return (
    <div className="space-y-4">
      <div className="line-clamp-2 text-title-md font-semibold">
        What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing
      </div>
      <div className="flex items-center h-full space-x-2">
        <NAvatar tooltip="" src="/images/course.jpg" name="nam" />
        <div className="flex flex-col justify-between space-y-1 leading-[1rem]">
          <div className="font-semibold ">Hoai Nam</div>
          <div className="text-gray-400 ">nam@gmail.com</div>
        </div>
      </div>

      <div className="flex justify-between">
        <div className="flex items-center space-x-2 w-[200px]">
          <SvgIcon
            icon="star"
            className="fill-system text-system icon icon-sm"
          ></SvgIcon>
          <span>4.7 (200,000 reviews) </span>
        </div>

        <div className="flex items-center space-x-2 w-[200px]">
          <SvgIcon icon="group" className="icon icon-sm"></SvgIcon>
          <span>1,000 students </span>
        </div>

        <div className="flex items-center space-x-2 w-[200px]">
          <SvgIcon icon="lightning" className="icon icon-sm"></SvgIcon>
          <span>Beginner level </span>
        </div>
      </div>

      <div>
        <ExpandableContent content={longContent} height={200} />
      </div>
    </div>
  );
};
