"use client";

import DefaultLayout from "@/components/Layouts/DefaultLayout";

const CourseLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <DefaultLayout>{children}</DefaultLayout>;
};

export default CourseLayout;