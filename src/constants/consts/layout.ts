import { MenuType, NavItem, User } from "@/models";
import { Role } from "../enums";
import { ROUTES } from "./routes";

export const HEADER_HEIGHT = "72px";

export const HomeNavItems: NavItem = {
  icon: "home",
  name: "Home",
  path: ROUTES.HOME,
};

export const SupportNavItems: NavItem = {
  icon: "support",
  name: "Support",
  path: ROUTES.SUPPORT,
};

export const CartNavItem: NavItem = {
  icon: "cart",
  name: "My Cart",
  path: ROUTES.CART,
};

export const AdminNavItems: NavItem[] = [
  {
    icon: "teamwork-icon",
    name: "User List",
    path: ROUTES.ADMIN_USER,
  },
  {
    icon: "report-all",
    name: "Report",
    path: ROUTES.ADMIN_SYSTEM,
  },
];

export const StudentNavItems: NavItem[] = [
  {
    icon: "learning-icon",
    name: "Registered Courses",
    path: ROUTES.MY_COURSE,
  },
  CartNavItem,
];

export const TeacherNavItems: NavItem[] = [
  {
    icon: "list",
    name: "My Courses",
    path: ROUTES.INSTRUCTOR,
  },
  {
    icon: "report",
    name: "Course Report",
    path: ROUTES.INSTRUCTOR_COURSE_REPORT,
  },
];

export const EduMgNavItems: NavItem[] = [
  {
    icon: "inspection",
    name: "Course Approval",
    path: ROUTES.MANAGE_APPROVAL,
  },
  {
    icon: "dashboard-report",
    name: "Course Report",
    path: ROUTES.MANAGE_COURSE_REPORT,
  },
];

export class NavbarMenu {
  static get({
    type = MenuType.NAV_BAR,
    role,
    user,
    extras,
  }: {
    role: Role;
    user: User;
    extras?: NavItem[];
    type?: MenuType;
  }) {
    if (!role || !user) {
      return [HomeNavItems];
    }
    const profile = {
      icon: "profile",
      name: "My Profile",
      path: `${ROUTES.USER}/${user.id}`,
    };

    const roles = {
      [Role.STUDENT]: StudentNavItems,
      [Role.TEACHER]: TeacherNavItems,
      [Role.EDUCATION_MANAGER]: EduMgNavItems,
      [Role.ADMIN]: AdminNavItems,
    };
    const items = roles[role];

    return [
      ...(type === MenuType.NAV_BAR ? [HomeNavItems] : []),
      profile,
      ...items,
      ...(extras || []),
      SupportNavItems,
    ];
  }
}
