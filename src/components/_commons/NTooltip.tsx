import { Tooltip } from "antd";

const NTooltip = ({
  title,
  placement,
  children,
}: {
  title: string | React.ReactNode;
  placement?:
    | "top"
    | "left"
    | "right"
    | "bottom"
    | "topLeft"
    | "topRight"
    | "bottomLeft"
    | "bottomRight"
    | "leftTop"
    | "leftBottom"
    | "rightTop"
    | "rightBottom";
  children: React.ReactNode;
}) => {
  return (
    <Tooltip title={title} placement={placement}>
      {children}
    </Tooltip>
  );
};

export default NTooltip;
