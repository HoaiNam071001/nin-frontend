import React from "react";
import { usePathname } from "next/navigation";
import { I18nLink } from "../_commons/I18nLink";

const SidebarDropdown = ({ item }: any) => {
  const pathname = usePathname();

  return (
    <>
      <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
        {item.map((item: any, index: number) => (
          <li key={index}>
            <I18nLink
              href={item.route}
              className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                pathname === item.route ? "text-white" : ""
              }`}
            >
              {item.label}
            </I18nLink>
          </li>
        ))}
      </ul>
    </>
  );
};

export default SidebarDropdown;
