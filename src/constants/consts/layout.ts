import { MenuType, NavItem, User } from "@/models";
import { ROUTES } from "./routes";
import { Role } from "../enums";

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

export const StudentNavItems: NavItem[] = [
  {
    icon: "cheque",
    name: "Registered Courses",
    path: ROUTES.MY_COURSE,
  },
  CartNavItem,
];

export const TeacherNavItems: NavItem[] = [
  {
    icon: "cheque",
    name: "My Courses",
    path: ROUTES.INSTRUCTOR,
  },
];

export const EduMgNavItems: NavItem[] = [
  {
    icon: "cheque",
    name: "Course Approval",
    path: ROUTES.MANAGE_APPROVAL,
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
      return [HomeNavItems, SupportNavItems];
    }
    const profile = {
      icon: "personal",
      name: "My Profile",
      path: `${ROUTES.USER}/${user.id}`,
    };

    const roles = {
      [Role.STUDENT]: StudentNavItems,
      [Role.TEACHER]: TeacherNavItems,
      [Role.EDUCATION_MANAGER]: EduMgNavItems,
      [Role.ADMIN]: [HomeNavItems, SupportNavItems],
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
