"use client";

import { Link } from "@/i18n/routing";

export function I18nLink({
  href,
  ...props
}: React.ComponentProps<typeof Link>) {
  return <Link href={href} {...props} />;
}
