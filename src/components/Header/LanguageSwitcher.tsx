"use client";

import { LocaleItems, routing } from "@/i18n/routing";
import { useParams, usePathname, useRouter } from "next/navigation";
import CustomDropdown from "../_commons/CustomDropdown";
import SvgIcon from "../_commons/SvgIcon";

const LanguageSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { locale } = useParams();

  const changeLanguage = (newLocale: string) => {
    if (locale === newLocale) return;
    const newPathname = `/${newLocale}${pathname.replace(/^\/(en|vi)/, "")}`;
    router.push(newPathname);
  };

  return (
    <CustomDropdown
      dWidth={150}
      trigger={
        <button
          type="button"
          className={`inline-flex items-center border border-[var(--n-border)] rounded-sm`}
        >
          <span className="bg-[var(--n-row-selected)] px-2 uppercase">
            {locale}
          </span>
          <SvgIcon
            icon="arrow"
            className="icon icon-sm text-[var(--n-secondary)] rotate-180"
          />
        </button>
      }
    >
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
    </CustomDropdown>
  );
};

export default LanguageSwitcher;
