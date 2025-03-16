

export const ROUTES = {
    HOME: '/',
    SIGN_IN: '/signin',
    SIGN_UP: '/signup',

    // instructor
    INSTRUCTOR: '/instructor',
    INSTRUCTOR_COURSE: '/instructor/course',

    // education manager
    MANAGE_APPROVAL: '/edu/approval',

    // course
    COURSE: '/course',
    COURSE_DETAIL: (slug: string) => `/course/${slug}/detail`,
    MY_COURSE: '/course/registered',
    PAYMENT: '/course/payment',

    // utils
    INSTRUCTOR_PREVIEW: '/w/preview',

    // user
    USER: '/user',
    CART: '/user/cart',
    USER_SETTING: '/user/settings',

    // search 
    SEARCH: '/search',

    // support
    SUPPORT: '/support',
}

export const PARAMS = {
    SEARCH: {
        CATEGORY: 'cat',
        LEVEL: 'lvl',
        KEYWORD: 'keyword',
    }
}