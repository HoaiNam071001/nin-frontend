
"use client"

import { ROUTES } from "@/constants";
import { Role } from "@/models";
import { RootState } from "@/redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const withRoleGuard = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  requiredRoles: Role[],
  path = ROUTES.HOME
) => {
  return function RoleGuardedComponent(props: P) {
    const router = useRouter();
    const { user } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
      if (
        !user ||
        !requiredRoles.some((role) =>
          !user.roles?.some((e) => role === e.roleName)
        )
      ) {
        router.push(path);
      }
    }, [user, router, requiredRoles, path]);

    return <WrappedComponent {...props} />;
  };
};

export default withRoleGuard;
