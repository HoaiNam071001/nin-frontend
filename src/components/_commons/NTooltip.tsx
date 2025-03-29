import { Tooltip } from "antd";

const NTooltip = ({
  title,
  placement,
  children,
  color = 'black',
}: {
  title: string | React.ReactNode;
  color?: string;
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
    <Tooltip title={title} placement={placement} color={color}>
      {children}
    </Tooltip>
  );
};

export default NTooltip;
