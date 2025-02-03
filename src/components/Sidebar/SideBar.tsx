import { HEADER_HEIGHT, LayoutStorageKey } from "@/constants";
import React, { useEffect, useState } from "react";
import SvgIcon from "../_commons/SvgIcon";
import NTooltip from "../_commons/NTooltip";
import NButton from "../_commons/NButton";
import { NavItem } from "@/models";
import { useI18nRouter } from "@/hooks/useI18nRouter";
import I18n from "../_commons/I18n";
import { usePathname } from "@/i18n/routing";

interface SidebarProps {
  navItems: NavItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ navItems }) => {
  const [collapsed, setCollapsed] = useState(() => {
    const storedMode = localStorage.getItem(LayoutStorageKey.SIDEBAR_MODE);
    return storedMode ? JSON.parse(storedMode) : false;
  });
  const router = useI18nRouter();
  const pathname = usePathname();

  const toggleSidebar = () => {
    const mode = !collapsed;
    setCollapsed(mode);
    localStorage.setItem(LayoutStorageKey.SIDEBAR_MODE, JSON.stringify(mode));
  };

  const navigate = (item: NavItem) => {
    router.push(item.path);
  };

  return (
    <div
      className={`flex flex-col py-3 ${
        collapsed ? "w-16" : "w-64"
      } shadow-lg transition-all sticky z-10`}
      style={{
        top: HEADER_HEIGHT,
        height: `calc(100vh - ${HEADER_HEIGHT})`,
      }}
    >
      {/* Sidebar Menu */}
      <div className="flex flex-col gap-1">
        {navItems.map((item, index) => (
          <NTooltip
            title={collapsed ? <I18n i18key={item.name} /> : ""}
            key={index}
            placement="right"
          >
            <div
              className={`flex items-center gap-3 px-3 py-3 group mx-2 cursor-pointer rounded-md relative ${
                pathname === item.path ? "text-system bg-system bg-opacity-10" : "hover:bg-[var(--n-row-hover)]"
              }`}
              onClick={() => navigate(item)}
            >
                {/* Icon */}
                <div className="flex items-center justify-center">
                  {typeof item.icon === "string" ? (
                    <SvgIcon icon={item.icon} className="icon icon-md" />
                  ) : (
                    item.icon
                  )}
                </div>

                {/* Name */}
                {!collapsed && (
                  <span className="text-sm transition-all text-ellipsis">
                    <I18n i18key={item.name} />
                  </span>
                )}

                {item.attach && (
                  <div
                    className={`text-[10px] ${
                      collapsed ? "absolute top-1 left-[50%]" : ""
                    }`}
                  >
                    {item.attach}
                  </div>
                )}
            </div>
          </NTooltip>
        ))}
      </div>

      {/* Toggle Button */}

      <NButton
        color="primary"
        variant="filled"
        size="sm-circle"
        shape="full"
        onClick={toggleSidebar}
        className="absolute bottom-4 left-3"
      >
        <SvgIcon
          icon="arrow"
          className={`icon icon-md ${collapsed ? "rotate-90" : "-rotate-90"}`}
        />
      </NButton>
    </div>
  );
};

export default Sidebar;
