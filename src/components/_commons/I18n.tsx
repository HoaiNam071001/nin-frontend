"use client";
import { useTranslate } from "@/hooks/useTranslate";

interface I18nProps {
  i18key: string;
  className?: string;
  params?: Record<string, string | number>;
}

const I18n: React.FC<I18nProps> = ({ i18key, className, params }) => {
  const translate = useTranslate();

  return <span className={className}>{translate(i18key, params)}</span>;
};

export default I18n;