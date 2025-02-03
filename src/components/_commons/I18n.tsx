"use client"
import { useTranslate } from "@/hooks/useTranslate";

const I18n: React.FC<{ i18key: string, className?: string }> = ({ i18key, className }) => {
  const translate = useTranslate();

  return <span className={className}>{translate(i18key)}</span>;
};

export default I18n;
