import React from "react";
import { Metadata } from "next";
import SignIn from ".";

export const metadata: Metadata = {
  title: "Sign in - NIN Education",
  description:
    "NIN is a 4.0 technology platform that provides a comprehensive solution for organizing, managing, and delivering online learning. It supports the storage of resources such as videos, documents, and interactive lectures, as well as the management of courses, users, and learning progress.",
  icons: "/images/logo.png",
};

const SignInPage: React.FC = () => {
  return (
    <>
      <SignIn></SignIn>
    </>
  );
};

export default SignInPage;
