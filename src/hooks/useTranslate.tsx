import { useTranslations } from "next-intl";

// Custom hook for translation
export const useTranslate = () => {
  const t = useTranslations();
  
  const translate = (i18key: string, params?: Record<string, string | number>) => {
    // Nếu key tồn tại, dịch với params (nếu có), nếu không trả về key
    return t.has(i18key) ? t(i18key, params) : i18key;
  };

  return translate;
};
