import { Section } from "@/models/course/section.model";
import { NFile, SystemFileType } from "@/models/file.model";
import { sectionService } from "@/services/courses/section.service";
import { toastService } from "@/services/toast.service";
import { useState } from "react";
import NButton from "../_commons/NButton";
import SvgIcon from "../_commons/SvgIcon";
import FileUpload from "../_commons/FileUpload";
import { formatFileSize } from "@/helpers";
import { Button, Popconfirm } from "antd";
import { formatDate } from "@/helpers/date";

export const SectionFiles = ({
  sectionId,
  files,
  canEdit = false,
  download = false,
  addFile,
  removeFile,
}: {
  sectionId: number;
  files: NFile[];
  canEdit?: boolean;
  download?: boolean;
  addFile?: (file: NFile) => void;
  removeFile?: (file: NFile) => void;
}) => {
  const [editing, setEditing] = useState(false);

  const handleFileUpload = async (file: File) => {
    const data: NFile = await sectionService.addFile(sectionId, file);
    setEditing(false);
    if (data) {
      addFile(data);
    }
  };

  const onRemoveFile = async (file: NFile) => {
    try {
      await sectionService.removeFile(file.id);
      file.deleted = true;
      removeFile(file);
    } catch (error) {
      toastService.error(error.message);
    }
  };

  const onDownload = (file: NFile) => {
    if (!download) {
      return;
    }

    window.open(file.url, '_blank')
  }

  return (
    <div className="max-h-[300px] overflow-auto">
      {editing && (
        <div className="relative border border-stroke p-3 bg-white rounded">
          <NButton
            className="absolute top-3 right-3 p-0"
            size="sm-circle"
            variant="link"
            onClick={() => setEditing(false)}
          >
            <SvgIcon className="icon icon-sm" icon="close" />
          </NButton>
          <div className="flex justify-center">
            <FileUpload upload={handleFileUpload} label={"Upload Resources"} />
          </div>
          {/* <div className="flex justify-end items-center">
              <NButton onClick={() => setEditing(false)}>Save</NButton>
            </div> */}
        </div>
      )}
      {!editing && (
        <>
          <div className="mb-2 px-2">
            {files?.map((file, index) => (
              <div key={index}>
                {!file.deleted &&
                  file.systemType !== SystemFileType.VIDEO_CONTENT && (
                    <div className="flex items-center overflow-hidden py-1">
                      <div className={`flex-1 text-ellipsis mr-4 overflow-hidden text-nowrap ${download ? 'cursor-pointer hover:underline hover:text-primary' : ''}`} 
                        onClick={()=> onDownload(file)}>
                        {file.name}
                      </div>
                      <div className="w-[80px] min-w-[80px]">
                        {formatFileSize(file.size)}
                      </div>
                      <div className="w-[120px] min-w-[120px]">
                        {formatDate(file.createdAt)}
                      </div>
                      {canEdit && (
                        <div className="w-[20px] min-w-[20px]">
                          <Popconfirm
                            placement="left"
                            title={"Delete File"}
                            description={"Do you want to delete this file?"}
                            okText="Yes"
                            cancelText="No"
                            onConfirm={() => onRemoveFile(file)}
                          >
                            <Button className="p-0 border-0 hover:!text-red bg-transparent">
                              <SvgIcon className="icon icon-sm" icon="close" />
                            </Button>
                          </Popconfirm>
                        </div>
                      )}
                    </div>
                  )}
              </div>
            ))}
          </div>
          {canEdit && (
            <NButton variant="outlined" onClick={() => setEditing(true)}>
              Add Resources
            </NButton>
          )}
        </>
      )}
    </div>
  );
};
