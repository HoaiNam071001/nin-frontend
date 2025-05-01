"use client";

import NButton from "@/components/_commons/NButton";
import SvgIcon from "@/components/_commons/SvgIcon";
import CourseBreadcrumb from "../../_components/course-breadcrumb";

const DetailTitle = ({ course, collapsed, setCollapsed }) => {
  return (
    <>
      {course && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center relative">
            <CourseBreadcrumb course={course} />

            <NButton
              color="primary"
              variant="filled"
              size="sm-circle"
              shape="full"
              onClick={() => setCollapsed(!collapsed)}
              className="absolute top-0 right-0 transition-all duration-300 ease-in-out"
            >
              <SvgIcon
                icon="arrow"
                className={`icon icon-md transition-transform duration-300 ease-in-out ${
                  !collapsed ? "rotate-90" : "-rotate-90"
                }`}
              />
            </NButton>
          </div>
          <div className="transition-all duration-300 ease-in-out">
            <div className="line-clamp-2 text-title-md font-semibold">
              {course?.name}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DetailTitle;
