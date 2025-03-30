import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Metadata } from "next";
import Education from "./w/_Education";

export const metadata: Metadata = {
  title: "Home - NIN Education",
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
