import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Locales, routing } from "@/i18n/routing";
import AppInitializerWithProvider from "../appInitializer";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import NotFound from "@/components/utils/NotFound";

export const metadata: Metadata = {
  title: "NIN Education",
  description:
    "NIN is a 4.0 technology platform for organizing, managing, and delivering online learning. It supports storing videos, documents, interactive lectures, and managing courses, users, and progress.",
  icons: "/images/logo.png",
};

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!routing.locales.includes(locale as Locales)) {
    return <html lang="en">
      <body><NotFound/></body></html>
  }

  const messages = await getMessages({ locale });

  return (
    <html lang={locale}>
      <body suppressHydrationWarning>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <AppInitializerWithProvider>{children}</AppInitializerWithProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
