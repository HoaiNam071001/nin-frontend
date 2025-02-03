"use client";

import DefaultLayout from "@/components/Layouts/DefaultLayout";

const SearchLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <DefaultLayout>{children}</DefaultLayout>;
};

export default SearchLayout;