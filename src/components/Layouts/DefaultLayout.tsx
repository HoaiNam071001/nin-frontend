"use client";
import React, { useEffect, useState } from "react";
// import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import SideBar from "../Sidebar/SideBar";
import useAuth from "@/hooks/useAuth";
import { HEADER_HEIGHT, NavbarMenu } from "@/constants";
import { NavItem } from "@/models";

export default function DefaultLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <>
      <div className="relative">
        <Header />

        {/* <!-- ===== Header End ===== --> */}

        {/* <!-- ===== Main Content Start ===== --> */}
        <main>
          <div className="flex">
            <Nav />
            <div
              className="flex-1 p-4 md:p-6 2xl:p-10 overflow-auto relative"
              style={{
                height: `calc(100vh - ${HEADER_HEIGHT})`,
              }}
            >
              {children}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

const Nav = () => {
  const { activeRole, currentUser } = useAuth();
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  useEffect(() => {
    setNavItems(
      NavbarMenu.get({
        role: activeRole,
        user: currentUser,
      })
    );
  }, [activeRole, currentUser]);

  return <SideBar navItems={navItems} />;
};
