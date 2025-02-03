import { useTranslations } from "next-intl";

// Custom hook for translation
export const useTranslate = () => {
  const t = useTranslations();
  
  const translate = (i18key: string) => {
    return t.has(i18key) ? t(i18key) : i18key;
  };
  
  return translate;
};
