import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { Locales, routing } from "@/i18n/routing";
import AppInitializerWithProvider from "../appInitializer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "NIN Education",
  description:
    "NIN is a 4.0 technology platform that provides a comprehensive solution for organizing, managing, and delivering online learning. It supports the storage of resources such as videos, documents, and interactive lectures, as well as the management of courses, users, and learning progress.",
  icons: "/images/logo.png",
};

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as Locales)) {
    notFound();
  }
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages({ locale });

  return (
    <html lang={locale}>
      <body suppressHydrationWarning={true}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <AppInitializerWithProvider>{children}</AppInitializerWithProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
