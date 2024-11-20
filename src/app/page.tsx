import Education from "@/components/Education";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "NIN Education",
  description: "NIN is a 4.0 technology platform that provides a comprehensive solution for organizing, managing, and delivering online learning. It supports the storage of resources such as videos, documents, and interactive lectures, as well as the management of courses, users, and learning progress.",
  icons: '/images/logo.png'
};

export default function Home() {
  return (
    <>
      <DefaultLayout>
        <Education></Education>
      </DefaultLayout>
    </>
  );
}
