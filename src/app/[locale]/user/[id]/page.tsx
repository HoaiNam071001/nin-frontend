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
      <div className="rounded-lg shadow-lg bg-blue-50">
        <div className="relative flex gap-4 p-4 rounded-md">
          <NAvatar size="xxl" src={user.avatar} name={user.fullName} />
          <div className=" p-2">
            <div className="text-title-lg  font-semibold flex">
              <div className="relative">
                {user.fullName}
                {currentUser?.id === user?.id && (
                  <div className="absolute -right-[40px] top-2">
                    <NButton variant="link" tooltip="Edit" onClick={onSetting}>
                      <SvgIcon className="icon icon-sm" icon={"edit"}></SvgIcon>
                    </NButton>
                  </div>
                )}
              </div>
            </div>
            <div>{user.email}</div>
            <div className="text-secondary">{user.bio}</div>
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
