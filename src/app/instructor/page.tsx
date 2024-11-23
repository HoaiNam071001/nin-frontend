"use client";

import NButton from "@/components/_commons/NButton";
import SvgIcon from "@/components/_commons/SvgIcon";
import { ROUTES } from "@/constants";
import { useRouter } from "next/navigation";

const CourseBoard: React.FC = () => {
  const router = useRouter();

  return (
    <div className="h-[80vh] rounded-md flex container mx-auto">
      <div>
        <NButton
          variant="primary"
          className="w-full"
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
    </div>
  );
};

export default CourseBoard;
