import { Role, RoleBackgrounds, RoleLabels } from "@/constants";
import React from "react";

const RoleLabel = ({ role }: { role: Role }) => {
  return (
    <div className={`px-2 ${RoleBackgrounds[role]} rounded-md text-white`}>
      <span>{RoleLabels[role]}</span>
    </div>
  );
};

export default RoleLabel;
