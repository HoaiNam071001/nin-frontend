"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { LocaleItems, routing } from "@/i18n/routing";
import SvgIcon from "../_commons/SvgIcon";
import ClickOutside from "../_commons/ClickOutside";

const LanguageSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { locale } = useParams(); // Lấy locale hiện tại
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const changeLanguage = (newLocale: string) => {
    if (locale === newLocale) return;

    // Thay đổi locale trên URL
    const newPathname = `/${newLocale}${pathname.replace(/^\/(en|vi)/, "")}`;
    router.push(newPathname);
  };

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)}>
      <div className="relative inline-block text-left">
        <button
          type="button"
          className="inline-flex items-center border border-[var(--n-border)] uppercase rounded-sm"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <span className="bg-[var(--n-row-selected)] px-2">{locale}</span>
          <SvgIcon
            icon="arrow"
            className="icon icon-sm text-[var(--n-secondary)] rotate-180"
          />
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="origin-top-right absolute right-0 mt-2 w-[150px] rounded-md shadow-lg bg-white">
            {routing.locales.map((cur) => (
              <div
                key={cur}
                className={`block px-4 py-2 text-sm cursor-pointer hover:bg-[var(--n-row-hover)] ${
                  locale === cur ? "bg-[var(--n-row-selected)]" : ""
                }`}
                onClick={() => changeLanguage(cur)}
              >
                {LocaleItems[cur]?.name || cur}
              </div>
            ))}
          </div>
        )}
      </div>
    </ClickOutside>
  );
};

export default LanguageSwitcher;
