import { DEFAULT_COURSE_THUMBNAIL } from "@/constants";
import Image from "next/image";

interface CustomImageProps {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  svgIcon?: string;
}

const CustomImage: React.FC<CustomImageProps> = ({
  src,
  alt,
  width = 100, 
  height = 75,
  className = "",
  svgIcon
}) => {
  const svg = svgIcon ? `/icons/${svgIcon}.svg` : null;
  
  return (
    <Image
      src={src || svg || DEFAULT_COURSE_THUMBNAIL}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  );
};

export default CustomImage;
