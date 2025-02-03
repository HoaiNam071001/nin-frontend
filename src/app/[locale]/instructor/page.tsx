"use client";

import NButton from "@/components/_commons/NButton";
import SvgIcon from "@/components/_commons/SvgIcon";
import { ROUTES } from "@/constants";
import MyCourse from "./course/_components/MyCourse";
import { useI18nRouter } from "@/hooks/useI18nRouter";

const CourseBoard: React.FC = () => {
  const router = useI18nRouter();

  return (
    <div className="h-[80vh] rounded-md container mx-auto">
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

      <MyCourse />
    </div>
  );
};

export default CourseBoard;
