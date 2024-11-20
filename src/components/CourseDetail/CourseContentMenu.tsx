"use client";

import { Button } from "antd";
import SvgIcon from "../_commons/SvgIcon";
import { SectionMenu } from "../Course/SectionMenu";

const CourseContentMenu = () => {
  return (
    <div className="space-y-3">
      <div className="font-semibold text-title-sm">Course Content</div>
      <div className="flex items-center text-gray-400">
        <span>20 sections </span>
        <SvgIcon icon="dot" className="icon icon-sm"></SvgIcon>
        <span>30h 20m total length</span>

        <Button type="link">Link</Button>
      </div>
      <SectionMenu />
    </div>
  );
};

export default CourseContentMenu;
