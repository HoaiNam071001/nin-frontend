"use client";

import DefaultLayout from "@/components/Layouts/DefaultLayout";

const UserLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <DefaultLayout>{children}</DefaultLayout>;
};

export default UserLayout;