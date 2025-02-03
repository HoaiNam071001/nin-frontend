"use client";

import DefaultLayout from "@/components/Layouts/DefaultLayout";

const SupportLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <DefaultLayout>{children}</DefaultLayout>;
};

export default SupportLayout;