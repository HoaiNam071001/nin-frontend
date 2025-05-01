"use client";

import NAvatar from "@/components/_commons/NAvatar";
import NButton from "@/components/_commons/NButton";
import SvgIcon from "@/components/_commons/SvgIcon";
import { ROUTES } from "@/constants";
import useAuth from "@/hooks/useAuth";
import { useI18nRouter } from "@/hooks/useI18nRouter";
import { User } from "@/models";
import { toastService } from "@/services/toast.service";
import { userService } from "@/services/user/user.service";
import { useEffect, useState } from "react";
import UseTab from "../_components/UseTab";
interface PageProps {
  params: { id: number };
}

const UserDetail: React.FC = ({ params }: PageProps) => {
  const { currentUser } = useAuth();
  const [user, setUser] = useState<User>();
  const router = useI18nRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const _user = await userService.getUserById(params.id);
        setUser(_user);
      } catch (error: any) {
        toastService.error(error?.message || "500 Error");
      }
    };

    fetchUser();
  }, [params.id]);

  const onSetting = () => {
    router.push(ROUTES.USER_SETTING);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="">
      <div className="rounded-2xl shadow-lg border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-700 transition-all duration-300 hover:shadow-xl">
        <div className="flex flex-col md:flex-row gap-6 p-6 sm:p-8">
          <div className="flex-shrink-0">
            <NAvatar
              size="xxl"
              src={user.avatar}
              name={user.fullName}
              className="ring-4 ring-gray-100 dark:ring-gray-800 rounded-full transition-transform duration-200 hover:scale-105"
              alt={`${user.fullName}'s avatar`}
            />
          </div>
          <div className="flex-1 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight capitalize">
                {user.fullName}
              </h2>
              {currentUser?.id === user?.id && (
                <NButton
                  variant="link"
                  size="sm"
                  tooltip="Edit Profile"
                  onClick={onSetting}
                  className="text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-gray-800 border-blue-200 dark:border-blue-700"
                  aria-label="Edit profile"
                >
                  <SvgIcon
                    className="w-4 h-4 mr-1"
                    icon="edit"
                    aria-hidden="true"
                  />
                </NButton>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex flex-col">
                <span className="font-semibold">Email</span>
                <span className="text-gray-600 dark:text-gray-400">
                  {user.email}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold">Phone</span>
                <span className="text-gray-600 dark:text-gray-400">
                  {user.phoneNumber || "Not available"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold">Birthday</span>
                <span className="text-gray-600 dark:text-gray-400">
                  {user.birthDay || "Not specified"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold">Bio</span>
                <span className="text-gray-600 dark:text-gray-400">
                  {user.bio || "No bio provided"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 w-full">
        <UseTab user={user} />
      </div>
    </div>
  );
};

export default UserDetail;
