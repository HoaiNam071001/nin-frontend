"use client";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Role, ROUTES } from "@/constants";
import withRoleGuard from "@/guards/withRoleGuard";

const CourseLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <DefaultLayout>{children}</DefaultLayout>;
};

// client to check role
export default withRoleGuard(
  CourseLayout,
  [Role.TEACHER, Role.EDUCATION_MANAGER, Role.ADMIN],
  ROUTES.INSTRUCTOR_PREVIEW
);
