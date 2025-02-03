import CustomImage from "@/components/_commons/CustomImage";
import SvgIcon from "@/components/_commons/SvgIcon";
import { CourseFileType } from "@/models";
import { Modal } from "antd";
import { useState } from "react";

export const CourseFilePreview = ({ url, type }: { url: string; type: CourseFileType }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
  
    const showModal = () => {
      setIsModalOpen(true);
    };
  
    const handleOk = () => {
      setIsModalOpen(false);
    };
  
    const handleCancel = () => {
      setIsModalOpen(false);
    };
  
    return (
      <>
        <div className="cursor-pointer relative group" onClick={showModal}>
          <CustomImage
            src={
              type === CourseFileType.VIDEO
                ? "/images/video.png"
                : "/images/file.png"
            }
            alt="preview"
            className="w-20 h-20 object-cover rounded-lg"
          />
  
          <div className="absolute rounded-sm w-full h-full top-0 flex items-center justify-center opacity-0 bg-slate-400 group-hover:opacity-80 transition-opacity duration-100">
            <SvgIcon icon="zoom"></SvgIcon>
          </div>
        </div>
  
        <Modal
          footer={null}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          width="700px"
        >
          <div className="mt-8 flex justify-center">
            {type === CourseFileType.VIDEO ? (
              <video controls className="w-full">
                <source src={url || ""} />
                Your browser does not support the video tag.
              </video>
            ) : (
              <CustomImage src={url} alt="preview" className="w-[600px]" />
            )}
          </div>
        </Modal>
      </>
    );
  };
  