"use client";

import NButton from "@/components/_commons/NButton";
import SvgIcon from "@/components/_commons/SvgIcon";
import { ROUTES } from "@/constants";
import { useI18nRouter } from "@/hooks/useI18nRouter";
import MyCourse from "./course/_components/MyCourse";

const CourseBoard: React.FC = () => {
  const router = useI18nRouter();

  return (
    <div className=" rounded-md container mx-auto bg-slate-50 border-stroke border p-[40px] shadow-lg flex flex-col">
      <div className="mb-4">
        <NButton
          variant="solid"
          color="primary"
          onClick={() => router.push(`${ROUTES.INSTRUCTOR_COURSE}`)}
        >
          <div className="flex items-center">
            Create New Course
            <SvgIcon
              icon="arrow"
              className="icon icon-sm rotate-90 ml-auto"
            ></SvgIcon>
          </div>
        </NButton>
      </div>

      <div className="flex-1 overflow-hidden">
        <MyCourse />
      </div>
    </div>
  );
};

export default CourseBoard;
