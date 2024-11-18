import SvgIcon from "@/components/_commons/SvgIcon";
import { CourseFileType } from "@/models";
import { Dropdown, MenuProps } from "antd";
import { useRef, useState } from "react";

export const CourseFileUpload = ({
    upload,
  }: {
    upload: (file: File, type: CourseFileType) => void;
  }) => {
    const [selectedFileType, setSelectedFileType] =
      useState<CourseFileType | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
  
    const handleMenuClick = (fileType: CourseFileType) => {
      setSelectedFileType(fileType);
      setTimeout(() => {
        if (fileInputRef.current) {
          fileInputRef.current.click(); // Programmatically click the file input
        }
      }, 0);
    };
  
    const items: MenuProps["items"] = [
      {
        key: CourseFileType.VIDEO,
        label: (
          <div className="flex space-x-2 items-center">
            <SvgIcon icon="video-file" />
            <span>Video</span>
          </div>
        ),
        onClick: () => handleMenuClick(CourseFileType.VIDEO),
      },
      {
        key: CourseFileType.FILE,
        label: (
          <div className="flex space-x-2 items-center">
            <SvgIcon icon="file" />
            <span>File</span>
          </div>
        ),
        onClick: () => handleMenuClick(CourseFileType.FILE),
      },
    ];
  
    // Determine the accept type for the file input based on the selected type
    const getAcceptType = () => {
      if (selectedFileType === CourseFileType.VIDEO) {
        return "video/*"; // Allows all video types
      }
      return "*/*"; // Allows all file types (default for File)
    };
  
    return (
      <div>
        <Dropdown menu={{ items }} placement="bottomRight">
          <span className="cursor-pointer border-stroke border px-3 py-2 rounded-full bg-white">
            Add Resources
          </span>
        </Dropdown>
  
        {selectedFileType && (
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept={getAcceptType()} // Set the accept type based on selected type
            onChange={(e) => {
              if (e.target.files?.[0]) {
                upload(e.target.files[0], selectedFileType);
                e.target.value = "";
                setSelectedFileType(null);
              }
            }}
          />
        )}
      </div>
    );
  };
  