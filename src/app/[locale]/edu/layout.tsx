"use client";

import DefaultLayout from "@/components/Layouts/DefaultLayout";

const EduLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <DefaultLayout>{children}</DefaultLayout>;
};

export default EduLayout;