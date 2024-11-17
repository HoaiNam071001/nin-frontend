import React, { useRef, useState } from "react";
import { useForm, useFieldArray, Control } from "react-hook-form";
import { CourseSubmit } from "./CourseSubmit";
import { CourseFileType, SettingSubmitProps } from "@/models";
import FormInput from "../_commons/FormInput";
import NButton from "../_commons/NButton";
import SvgIcon from "../_commons/SvgIcon";
import { formatFileSize } from "@/utils/formatNumber";
import CustomImage from "../_commons/CustomImage";
import { Button, Dropdown, Empty, MenuProps, Modal, Popconfirm } from "antd";

type SubArrayItem = {
  name: string;
  size: number;
  time: string;
  url: string;
  type: CourseFileType;
};

type MainArrayItem = {
  name: string;
  description: string;
  children: MainArrayItem[];
  files: SubArrayItem[];
};

type FormValues = {
  root: MainArrayItem[];
};

export const CourseContent: React.FC<SettingSubmitProps> = ({
  moveToNextStep,
  moveToPrevStep,
}) => {
  const { register, control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      root: [
        {
          name: "",
          description: "",
          children: [],
          files: [],
        },
      ],
    },
  });

  const {
    fields: mainFields,
    append: appendMain,
    remove: removeMain,
  } = useFieldArray({
    control,
    name: "root",
  });

  const onNext = () => {
    handleSubmit((data) => onSubmit(data, () => moveToNextStep?.()))();
  };

  const onPrev = () => {
    handleSubmit((data) => onSubmit(data, () => moveToPrevStep?.()))();
  };

  const onSubmit = (data, callback) => {
    console.log(data);
    callback();
  };

  return (
    <>
      {mainFields.map((mainField, mainIndex) => (
        <div
          key={mainField.id}
          className=" border px-4 rounded border-stroke relative"
        >
          <div className="absolute top-0 right-0">
            <Popconfirm
              title="Delete the task"
              description="Are you sure to delete this Section?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => removeMain(mainIndex)}
            >
              <Button shape="round" type="link" danger>
                Remove Section
              </Button>
            </Popconfirm>
          </div>

          <div className="form-group">
            <label>Name</label>
            <FormInput
              name={`root.${mainIndex}.name`}
              control={control}
              defaultValue={""}
              rules={{
                required: "Name is required",
              }}
              placeholder="Enter Name"
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <FormInput
              name={`root.${mainIndex}.description`}
              control={control}
              defaultValue={""}
              placeholder="Enter Description"
            />
          </div>

          <div className="form-group">
            <label>Content</label>
            <SubArrayForm control={control} parentIndex={`${mainIndex}`} />
          </div>

          <div className="space-y-4">
            <ChildrenForm control={control} parentIndex={mainIndex} />
          </div>
        </div>
      ))}

      <div className="mt-3">
        <NButton
          shape="xxl"
          variant="primary"
          onClick={() =>
            appendMain({
              name: "",
              description: "",
              files: [],
              children: [],
            })
          }
        >
          Add Section
        </NButton>
      </div>

      <CourseSubmit
        moveToNextStep={onNext}
        moveToPrevStep={onPrev}
        cancel={moveToNextStep}
      ></CourseSubmit>
    </>
  );
};

function SubArrayForm({
  control,
  parentIndex,
}: {
  control: Control<FormValues>;
  parentIndex: string;
}) {
  const name = `root.${parentIndex}.files` as `root.${number}.files`;
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  const handleFileUpload = (file: File, type: CourseFileType) => {
    const newItem = {
      name: file.name,
      size: file.size,
      time: new Date().toISOString(),
      url: URL.createObjectURL(file),
      type,
    };

    append(newItem);
  };

  return (
    <div className="space-y-4 border border-stroke p-3 rounded-lg bg-slate-100">
      <div className="max-h-[300px] space-y-4 overflow-y-auto relative p-2 bg-white rounded-lg">
        {!fields.length && (
          <div>
            <Empty description={false} />
          </div>
        )}
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="flex items-center gap-4 p-2 border border-stroke rounded bg-white"
          >
            {/* Video hoặc biểu tượng file */}
            <FilePreview url={field.url} type={field.type}></FilePreview>

            {/* Tên và loại file */}
            <div className="flex-1">
              <div className="flex gap-4">
                <div className="flex-1">
                  <FormInput
                    name={`${name}.${index}.name`}
                    control={control}
                    defaultValue={""}
                    placeholder="Enter Description"
                  />
                </div>
                <div className="ml-auto">
                  <NButton
                    shape="xxl"
                    variant="white"
                    size="sm-circle"
                    onClick={() => remove(index)}
                  >
                    <SvgIcon icon="close"></SvgIcon>
                  </NButton>
                </div>
              </div>
              <div className="flex gap-4 mt-2">
                <div className="w-1/2">{formatFileSize(field.size)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex">
        <FileUpload upload={handleFileUpload}></FileUpload>
        <div className="ml-auto">{fields.length || 0} File(s)</div>
      </div>
    </div>
  );
}

function ChildrenForm({
  control,
  parentIndex,
}: {
  control: Control<FormValues>;
  parentIndex: number;
}) {
  const name = `root.${parentIndex}.children` as "root";
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  return (
    <>
      {fields.map((field, childIndex) => (
        <div key={field.id} className="border p-4 rounded border-stroke">
          <div className="form-group">
            <label>Name</label>
            <FormInput
              name={`${name}.${childIndex}.name`}
              control={control}
              defaultValue={""}
              rules={{
                required: "Name is required",
              }}
              placeholder="Enter Name"
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <FormInput
              name={`${name}.${childIndex}.description`}
              control={control}
              defaultValue={""}
              placeholder="Enter Description"
            />
          </div>

          <div className="form-group">
            <label>Content</label>
            <SubArrayForm
              control={control}
              parentIndex={`${parentIndex}.${childIndex}`}
            />
          </div>

          <div className="mt-4">
            <Popconfirm
              title="Delete the task"
              description="Are you sure to delete this Section?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => remove(childIndex)}
            >
              <Button danger>Remove Section</Button>
            </Popconfirm>
          </div>
        </div>
      ))}
      <NButton
        shape="xxl"
        variant="primary"
        onClick={() =>
          append({
            name: "",
            description: "",
            files: [],
            children: [],
          })
        }
      >
        Add Child Section
      </NButton>
    </>
  );
}

const FileUpload = ({
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

const FilePreview = ({ url, type }: { url: string; type: CourseFileType }) => {
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
