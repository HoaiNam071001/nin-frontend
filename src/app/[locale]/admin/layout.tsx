"use client";

import DefaultLayout from "@/components/Layouts/DefaultLayout";

const AdminLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <DefaultLayout>{children}</DefaultLayout>;
};

export default AdminLayout;
// client to check role
// export default withRoleGuard(
//   CourseLayout,
//   [Role.ADMIN],
//   ROUTES.HOME
// );
