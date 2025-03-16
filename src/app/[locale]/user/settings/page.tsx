"use client";

import useAuth from "@/hooks/useAuth";
import { UserSetting } from "../_components/UserSetting";

const UserSettingPage: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <div className="container mx-auto">
      <UserSetting userId={currentUser.id} />
    </div>
  );
};

export default UserSettingPage;
