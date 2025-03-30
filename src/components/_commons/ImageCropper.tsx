import { useModal } from "@/providers/ModalProvider";
import { useCallback, useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import NButton from "./NButton";

interface CroppedAreaPixels {
  x: number;
  y: number;
  width: number;
  height: number;
}

const createCroppedImage = async (
  imageSrc: string,
  croppedAreaPixels: CroppedAreaPixels,
  maxOutputWidth: number,
  maxOutputHeight: number
): Promise<File | null> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) return null;

  let { width, height } = croppedAreaPixels;

  // Scale down if larger than max size
  if (width > maxOutputWidth || height > maxOutputHeight) {
    const scaleFactor = Math.min(
      maxOutputWidth / width,
      maxOutputHeight / height
    );
    width = Math.round(width * scaleFactor);
    height = Math.round(height * scaleFactor);
  }

  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(
    image,
    croppedAreaPixels.x,
    croppedAreaPixels.y,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
    0,
    0,
    width,
    height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "cropped_image.png", {
          type: "image/png",
        });
        resolve(file);
      } else {
        resolve(null);
      }
    }, "image/png");
  });
};

const createImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = url;
    img.onload = () => resolve(img);
    img.onerror = (error) => reject(error);
  });
};

interface ImageCropperProps {
  file: File;
  width?: number;
  height?: number;
  maxOutputWidth?: number;
  maxOutputHeight?: number;
  onCropComplete?: (croppedFile: File) => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({
  file,
  width = 200,
  height = 200,
  maxOutputWidth = 500,
  maxOutputHeight = 500,
  onCropComplete,
}) => {
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] =
    useState<CroppedAreaPixels | null>(null);
  const { closeModal } = useModal();

  useEffect(() => {
    if (file) {
      const blobUrl = URL.createObjectURL(file);
      setImage(blobUrl);
    }
  }, [file]);

  const handleCropComplete = useCallback(
    (_: any, croppedAreaPixels: CroppedAreaPixels) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleCropConfirm = async () => {
    if (croppedAreaPixels && image) {
      const croppedFile = await createCroppedImage(
        image,
        croppedAreaPixels,
        maxOutputWidth,
        maxOutputHeight
      );
      if (onCropComplete && croppedFile) {
        onCropComplete(croppedFile);
        close();
      }
    }
  };

  const close = () => {
    closeModal();
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 max-w-md mx-auto">
      {image && (
        <div className="relative w-full h-64 bg-gray-100">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={width / height}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
          />
        </div>
      )}
      <div className="flex justify-end gap-4">
        <NButton className="w-[100px]" variant="filled" onClick={close}>
          Cancel
        </NButton>
        <NButton className="w-[100px]" onClick={handleCropConfirm}>
          Save
        </NButton>
      </div>
    </div>
  );
};

export default ImageCropper;
