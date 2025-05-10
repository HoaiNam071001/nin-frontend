import { useModal } from "@/providers/ModalProvider";
import React, { useRef, useState } from "react";
import CustomImage from "./CustomImage";
import ImageCropper from "./ImageCropper";
import NButton from "./NButton";
import SvgIcon from "./SvgIcon";

const FileUpload = ({
  label = "Upload File",
  upload,
  showPreview = false,
  accept = "",
  children,
  className,
  width = 200,
  height = 200,
  disabled = false,
  crop = true,
}: {
  label: string;
  upload: (file: File) => void;
  showPreview?: boolean;
  accept?: string;
  className?: string;
  width?: number;
  height?: number;
  disabled?: boolean;
  children?: React.ReactNode;
  crop?: boolean;
}) => {
  const { openModal, closeModal } = useModal();

  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const handleFileChange = (e) => {
    const selectedFile: File = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      if (!crop) {
        const blob = new Blob([selectedFile], { type: selectedFile.type });
        const blobUrl = URL.createObjectURL(blob);
        upload?.(selectedFile);
        setPreviewUrl(blobUrl);
        return;
      }

      openModal({
        header: "Crop the image",
        content: (
          <>
            <ImageCropper
              width={width}
              height={height}
              file={selectedFile}
              onCropComplete={(file) => {
                closeModal();
                // Create a Blob from the selected file
                const blob = new Blob([file], { type: file.type });
                // // Generate a URL from the Blob
                const blobUrl = URL.createObjectURL(blob);
                upload?.(file);
                // Save the Blob URL to the previewUrl state
                setPreviewUrl(blobUrl);
              }}
            />
          </>
        ),
        onClose: () => {},
        config: {
          width: "600px",
        },
      });
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFileName("");
    setPreviewUrl("");
  };
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleMenuClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Programmatically click the file input
    }
  };

  return (
    <div className="flex items-center">
      <div
        className={disabled ? "pointer-events-none" : "cursor-pointer"}
        onClick={handleMenuClick}
      >
        {children ?? (
          <NButton variant="filled" className={className}>
            <div className="flex items-center space-x-2">
              <SvgIcon icon="upload" className="icon icon-sm" />
              <span>{label}</span>
            </div>
          </NButton>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        accept={accept}
        disabled={disabled}
        className="hidden"
        onChange={handleFileChange}
      />

      {/* File name and preview */}
      {showPreview && file && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-700">{fileName}</p>
          {previewUrl && (
            <div className="mt-2">
              <CustomImage
                src={previewUrl}
                alt="preview"
                className="w-32 h-32 object-cover rounded-lg"
              />
            </div>
          )}
          <button
            onClick={handleRemoveFile}
            disabled={disabled}
            className="mt-2 text-sm text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Remove File
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
