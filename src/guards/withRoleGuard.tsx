
"use client"

import { Role, ROUTES } from "@/constants";
import { useI18nRouter } from "@/hooks/useI18nRouter";
import { RootState } from "@/redux";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const withRoleGuard = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  requiredRoles: Role[],
  path = ROUTES.HOME
) => {
  return function RoleGuardedComponent(props: P) {
    const router = useI18nRouter();
    const { user } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
      if (
        !user ||
        !requiredRoles.some((role) =>
          user.roles?.some((e) => role === e.roleName)
        )
      ) {
        router.push(path);
      }
    }, [user, router]);

    return <WrappedComponent {...props} />;
  };
};

export default withRoleGuard;
