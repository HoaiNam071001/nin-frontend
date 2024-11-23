"use client"

import React from "react";

type SvgIconProps = {
  icon: string;
  className?: string;
};

const SvgIcon: React.FC<Partial<SvgIconProps>> = (props) => {
  const { icon, className } = props;
  // Đảm bảo src được định nghĩa
  const [svgContent, setSvgContent] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetch(`/icons/${icon}.svg`)
      .then((response) => response.text())
      .then((data) => {
        setSvgContent(data);
      });
  }, [icon]);

  return (
    <div
      className={'flex items-center justify-center ' + className} // Kết hợp class từ size và className
      dangerouslySetInnerHTML={{ __html: svgContent || "" }} // Render nội dung SVG
    />
  );
};

export default SvgIcon;
