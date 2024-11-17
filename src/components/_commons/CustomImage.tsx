import Image from "next/image";

interface CustomImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

const CustomImage: React.FC<CustomImageProps> = ({
  src,
  alt,
  width = 100, 
  height = 75,
  className = "",
}) => {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  );
};

export default CustomImage;
