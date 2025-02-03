"use client";
import React, { useEffect, useState } from "react";
// import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { DefaultNavItems } from "@/constants";
import useAuth from "@/hooks/useAuth";
import { NavItem } from "@/models";
import SideBar from "../Sidebar/SideBar";

export default function EducationLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    setNavItems([
      {
        icon: "cheque",
        name: "Course Dashboard",
        path: "#",
      },
      ...DefaultNavItems,
    ]);
  }, [isAuthenticated]);
  return (
    <>
    <div className="relative">
      <Header />
      <main>
        <div className="flex">
          <SideBar navItems={navItems} />
          <div className="flex-1 p-4 md:p-6 2xl:p-10">{children}</div>
        </div>
      </main>
    </div>
  </>
  );
}
