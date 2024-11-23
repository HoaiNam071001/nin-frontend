import Education from "@/components/Education";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Home - NIN Education",
}
export default function Home() {
  return (
    <>
      <DefaultLayout>
        <Education></Education>
      </DefaultLayout>
    </>
  );
}
