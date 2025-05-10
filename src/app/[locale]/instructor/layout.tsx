"use client";

import DefaultLayout from "@/components/Layouts/DefaultLayout";

const CourseLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <DefaultLayout>{children}</DefaultLayout>;
};

// client to check role
export default CourseLayout;
