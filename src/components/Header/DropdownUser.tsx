import { useEffect, useMemo, useState } from "react";
import ClickOutside from "@/components/_commons/ClickOutside";
import NAvatar from "../_commons/NAvatar";
import SvgIcon from "../_commons/SvgIcon";
import { useDispatch } from "react-redux";
import { authAction } from "@/redux";
import { NavbarMenu, Role, ROUTES } from "@/constants";
import NButton from "../_commons/NButton";
import useAuth from "@/hooks/useAuth";
import { MenuType, NavItem } from "@/models";
import { useI18nRouter } from "@/hooks/useI18nRouter";
import { I18nLink } from "../_commons/I18nLink";
import I18n from "../_commons/I18n";

const DropdownUser = () => {
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useI18nRouter();
  const { currentUser, activeRole } = useAuth();
  const [navItems, setNavItems] = useState<NavItem[]>([]);

  const roles = useMemo(() => {
    return {
      isTeacher: currentUser?.roles?.some((e) => e.roleName === Role.TEACHER),
      isEduMng: currentUser?.roles?.some(
        (e) => e.roleName === Role.EDUCATION_MANAGER
      ),
      isStudent: currentUser?.roles?.some((e) => e.roleName === Role.STUDENT),
    };
  }, [currentUser?.roles]);

  useEffect(() => {
    setNavItems(
      NavbarMenu.get({
        role: activeRole,
        user: currentUser,
        type: MenuType.USER_DROPDOWN,
      })
    );
  }, [activeRole, currentUser]);

  const onLogout = () => {
    dispatch(authAction.logout());
    router.push(ROUTES.HOME);
  };

  const switchRole = (role: Role) => {
    if (!role || !currentUser?.roles?.find((e) => e.roleName === role)) {
      return;
    }
    setDropdownOpen(false);
    if (role === Role.TEACHER) {
      router.push(ROUTES.INSTRUCTOR);
      dispatch(authAction.switchRole(role));
      return;
    }
    if (role === Role.EDUCATION_MANAGER) {
      router.push(ROUTES.MANAGE_APPROVAL);
      dispatch(authAction.switchRole(role));
      return;
    }
    router.push(ROUTES.HOME);
    dispatch(authAction.switchRole(role));
  };

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center"
      >
        <NAvatar
          tooltip=""
          src={currentUser?.avatar}
          name={currentUser?.fullName}
        />
        <span className="absolute bottom-[-5px] right-[-5px] p-0 rounded-full border border-white bg-slate-200 rotate-180 transition-all">
          <SvgIcon icon="arrow" className="icon icon-sm text-black"></SvgIcon>
        </span>
      </button>

      {/* <!-- Dropdown Start --> */}
      {dropdownOpen && (
        <div
          className={`absolute right-0 mt-4 flex w-[250px] flex-col rounded-md border border-stroke bg-white shadow-default`}
        >
          <div className="flex flex-col border-b border-stroke px-3 py-3">
            <div className="flex items-center h-full space-x-2">
              <NAvatar
                tooltip=""
                src={currentUser?.avatar}
                name={currentUser?.fullName}
              />
              <div className="flex flex-col justify-between space-y-1 leading-[1rem]">
                <div className="font-semibold ">{currentUser?.fullName}</div>
                <div className="text-black ">{currentUser?.email}</div>
              </div>
            </div>
          </div>

          {((roles.isStudent && activeRole !== Role.STUDENT) ||
            (roles.isTeacher && activeRole !== Role.TEACHER) ||
            (roles.isEduMng && activeRole !== Role.EDUCATION_MANAGER)) && (
            <div className="flex items-center flex-col py-2 text-gray-500 border-b border-b-[var(--n-border)]">
              {roles.isStudent && activeRole !== Role.STUDENT && (
                <NButton
                  className="w-full"
                  shape="none"
                  size="lg"
                  variant="text"
                  tooltip="Change Role to Student"
                  onClick={() => switchRole(Role.STUDENT)}
                >
                  <div className="flex items-center">
                    <I18n i18key="Student" />
                    <SvgIcon
                      icon="arrow"
                      className="icon icon-md rotate-90 ml-auto"
                    ></SvgIcon>
                  </div>
                </NButton>
              )}
              {roles.isTeacher && activeRole !== Role.TEACHER && (
                <NButton
                  className="w-full"
                  shape="none"
                  size="lg"
                  variant="text"
                  tooltip="Change Role to Teacher"
                  onClick={() => switchRole(Role.TEACHER)}
                >
                  <div className="flex items-center">
                    <I18n i18key="Lecturer" />
                    <SvgIcon
                      icon="arrow"
                      className="icon icon-md rotate-90 ml-auto"
                    ></SvgIcon>
                  </div>
                </NButton>
              )}

              {roles.isEduMng && activeRole !== Role.EDUCATION_MANAGER && (
                <NButton
                  className="w-full"
                  shape="none"
                  size="lg"
                  variant="text"
                  tooltip="Change Role to Education Manager"
                  onClick={() => switchRole(Role.EDUCATION_MANAGER)}
                >
                  <div className="flex items-center">
                    <I18n i18key="Education Manager" />
                    <SvgIcon
                      icon="arrow"
                      className="icon icon-md rotate-90 ml-auto"
                    ></SvgIcon>
                  </div>
                </NButton>
              )}
            </div>
          )}

          <ul className="flex flex-col border-b border-stroke px-6">
            {navItems.map((item, index) => (
              <li key={index}>
                <I18nLink
                  href={item.path}
                  className="flex items-center gap-3.5 hover:text-system py-2 duration-300 ease-in-out"
                >
                  <SvgIcon
                    icon={item.icon as string}
                    className="icon icon-sm"
                  ></SvgIcon>

                  <I18n i18key={item.name} />
                </I18nLink>
              </li>
            ))}
          </ul>
          <button
            onClick={onLogout}
            className="flex items-center gap-3.5 px-6 py-4 duration-300 ease-in-out hover:text-system"
          >
            <SvgIcon icon="out" className="icon icon-sm"></SvgIcon>
            
            <I18n i18key={'Log Out'} />
          </button>
        </div>
      )}
      {/* <!-- Dropdown End --> */}
    </ClickOutside>
  );
};

export default DropdownUser;
