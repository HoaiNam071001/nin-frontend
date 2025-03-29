export const ROUTES = {
  HOME: "/",
  SIGN_IN: "/signin",
  SIGN_UP: "/signup",

  // instructor
  INSTRUCTOR: "/instructor",
  INSTRUCTOR_COURSE: "/instructor/course",
  INSTRUCTOR_COURSE_REPORT: "/instructor/report",

  // education manager
  MANAGE_APPROVAL: "/edu/approval",
  MANAGE_COURSE_REPORT: "/edu/report",

  // course
  COURSE: "/course",
  COURSE_DETAIL: (slug: string) => `/course/${slug}/detail`,
  MY_COURSE: "/course/registered",
  PAYMENT: "/course/payment",

  // utils
  INSTRUCTOR_PREVIEW: "/w/preview",
  NOTIFICATION: "/w/notification",

  // user
  USER: "/user",
  CART: "/user/cart",
  USER_SETTING: "/user/settings",

  // search
  SEARCH: "/search",

  // support
  SUPPORT: "/support",

  // Admin
  ADMIN_USER: "/admin/users",
  ADMIN_COURSE: "/admin/course",
};

export const PARAMS = {
  SEARCH: {
    CATEGORY: "cat",
    LEVEL: "lvl",
    KEYWORD: "keyword",
  },
  NOTIFICATION: {
    ID: "id",
  },
};
