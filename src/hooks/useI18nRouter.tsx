"use client";

import { useRouter } from "@/i18n/routing";

export function useI18nRouter() {
  const router = useRouter();

  const push = (path: string) => {
    router.push(path);
  };

  return { ...router, push };
}
