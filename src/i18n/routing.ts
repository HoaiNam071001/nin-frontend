import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export type Locales = "vi" | "en";
export const LocaleItems = {
  vi: {
    name: "Tiếng Việt",
  },
  en: {
    name: "English",
  },
};
export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["vi", "en"],

  // Used when no locale matches
  defaultLocale: "en",
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
