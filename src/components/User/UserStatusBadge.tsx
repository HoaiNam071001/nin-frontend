interface StatusBadgeProps {
  active: boolean;
  activeText?: string;
  inactiveText?: string;
  className?: string;
}

const UserStatusBadge: React.FC<StatusBadgeProps> = ({
  active,
  activeText = "Activated",
  inactiveText = "Disabled",
  className = "",
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-sm font-medium ${
        active ? "bg-green-50 text-green-700" : "bg-red-50 text-red-500"
      } ${className}`}
    >
      {active ? activeText : inactiveText}
    </span>
  );
};

export default UserStatusBadge;
