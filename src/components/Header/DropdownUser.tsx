import { useState } from "react";
import Link from "next/link";
import ClickOutside from "@/components/_commons/ClickOutside";
import NAvatar from "../_commons/NAvatar";
import SvgIcon from "../_commons/SvgIcon";
import { User } from "@/models";
import { useDispatch } from "react-redux";
import { authAction } from "@/redux";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants";
import NButton from "../_commons/NButton";

const items = [
  {
    icon: "personal",
    label: "My Profile",
    link: "#",
  },
  {
    icon: "cheque",
    label: "My Learning",
    link: "#",
  },
  {
    icon: "support",
    label: "Support",
    link: "#",
  },
];

const DropdownUser = ({ user }: { user: User }) => {
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  const onLogout = () => {
    dispatch(authAction.logout());
    router.push(ROUTES.SIGN_IN);
  };

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center"
      >
        <NAvatar tooltip="" src={user.avatar} name={user.fullName} />
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
            <NAvatar tooltip="" src={user.avatar} name={user.fullName} />
            <div className="flex flex-col justify-between space-y-1 leading-[1rem]">
                <div className="font-semibold ">{user.fullName}</div>
                <div className="text-black ">{user.email}</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 px-6 pt-3 pb-2 text-gray-500">
            <NButton
              variant="primary"
              className="w-full"
              onClick={() => router.push(ROUTES.INSTRUCTOR)}
            >
              <div className="flex items-center">
                Instructor
                <SvgIcon
                  icon="arrow"
                  className="icon icon-sm rotate-90 ml-auto"
                ></SvgIcon>
              </div>
            </NButton>
          </div>

          <ul className="flex flex-col border-b border-stroke px-6">
            {items.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.link}
                  className="flex items-center gap-3.5 hover:text-system py-2 duration-300 ease-in-out"
                >
                  <SvgIcon icon={item.icon} className="icon icon-sm"></SvgIcon>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <button
            onClick={onLogout}
            className="flex items-center gap-3.5 px-6 py-4 duration-300 ease-in-out hover:text-system"
          >
            <SvgIcon icon="out" className="icon icon-sm"></SvgIcon>
            Log Out
          </button>
        </div>
      )}
      {/* <!-- Dropdown End --> */}
    </ClickOutside>
  );
};

export default DropdownUser;
