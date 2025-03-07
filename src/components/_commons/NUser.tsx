"use client";

import React from "react";
import NAvatar, { AvatarProps } from "./NAvatar";

interface UserProps extends AvatarProps {
  email?: string;
}

const NUser: React.FC<UserProps> = ({ ...rest }) => {
  return (
    <div className="flex items-center gap-2">
      <NAvatar {...rest} />
      <div className="flex flex-col">
        <div className="text-ellipsis">{rest.name}</div>
        {rest.email && <div className="text-slate-600 text-ellipsis">{rest.email}</div>}
      </div>
    </div>
  );
};

export default NUser;
