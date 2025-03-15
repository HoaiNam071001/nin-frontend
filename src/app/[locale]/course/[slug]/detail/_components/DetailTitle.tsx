"use client";

import NButton from "@/components/_commons/NButton";
import CourseBreadcrumb from "../../_components/course-breadcrumb";
import SvgIcon from "@/components/_commons/SvgIcon";
import { toastService } from "@/services/toast.service";

const DetailTitle = ({ course }) => {
  const handleCopyLink = async () => {
    try {
      const currentUrl = window.location.href;

      await navigator.clipboard.writeText(currentUrl);

      toastService.success("Link copied to clipboard!");
    } catch (error) {
      toastService.error("Failed to copy link!");
    }
  };
  return (
    <>
      {course && (
        <div className="grid gap-2">
          <div className="flex items-center">
            <CourseBreadcrumb course={course} />
            <div className="flex items-center gap-4 ml-auto">
              <NButton className="flex items-center gap-2" onClick={handleCopyLink}>
                <SvgIcon className="icon icon-sm" icon={"share"}></SvgIcon>Share
              </NButton>
            </div>
          </div>
          <div>
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
