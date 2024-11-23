import React from "react";
import { useForm, useFieldArray, Control } from "react-hook-form";
import { CourseSubmit } from "./CourseSubmit";
import {
  CourseFileType,
  CourseSectionItem,
  SettingSubmitProps,
} from "@/models";
import FormInput from "../_commons/FormInput";
import NButton from "../_commons/NButton";
import SvgIcon from "../_commons/SvgIcon";
import { formatFileSize } from "@/helpers";
import { Button, Empty, Popconfirm } from "antd";
import { CourseFilePreview } from "./_components/CourseFilePreview";
import { CourseFileUpload } from "./_components/CourseFileUpload";

type FormValues = {
  root: CourseSectionItem[];
};

export const CourseContent: React.FC<SettingSubmitProps> = ({
  moveToNextStep,
  moveToPrevStep,
}) => {
  const { control, handleSubmit } = useForm<FormValues>({
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

  const onNext = () => {
    handleSubmit((data) => onSubmit(data, () => moveToNextStep?.()))();
  };

  const onPrev = () => {
    handleSubmit((data) => onSubmit(data, () => moveToPrevStep?.()))();
  };

  const onSubmit = (data, callback) => {
    callback();
  };

  return (
    <>
      <div className="overflow-auto">
        <SectionArrray control={control}></SectionArrray>
      </div>

      <CourseSubmit
        moveToNextStep={onNext}
        moveToPrevStep={onPrev}
        cancel={moveToNextStep}
      ></CourseSubmit>
    </>
  );
};

function CourseFiles({
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
            <CourseFilePreview url={field.url} type={field.type} />

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
        <CourseFileUpload upload={handleFileUpload} />
        <div className="ml-auto">{fields.length || 0} File(s)</div>
      </div>
    </div>
  );
}

function SectionArrray({
  control,
  parentIndex,
}: {
  control: Control<FormValues>;
  parentIndex?: number;
}) {
  const isChildren = parentIndex !== undefined;
  const name = (isChildren ? `root.${parentIndex}.children` : "root") as "root";

  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  return (
    <div className="space-y-3">
      {fields.map((field, itemIndex) => (
        <div
          key={field.id}
          className="border p-4 rounded border-stroke relative"
        >
          <div className="absolute top-1 right-0">
            <Popconfirm
              title="Delete the section"
              description="Are you sure to delete this Section?"
              okText="Yes"
              cancelText="No"
              placement="left"
              onConfirm={() => remove(itemIndex)}
            >
              <Button type="link" danger>
                Remove Section
              </Button>
            </Popconfirm>
          </div>
          <div className="form-group">
            <label>Name</label>
            <FormInput
              name={`${name}.${itemIndex}.name`}
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
              name={`${name}.${itemIndex}.description`}
              control={control}
              defaultValue={""}
              rules={{
                required: "Name is required",
              }}
              placeholder="Enter Description"
            />
          </div>

          <div className="form-group">
            <label>Content</label>
            <CourseFiles
              control={control}
              parentIndex={`${isChildren ? parentIndex + "." : ""}${itemIndex}`}
            />
          </div>

          {!isChildren && (
            <div className="space-y-4">
              <SectionArrray control={control} parentIndex={itemIndex} />
            </div>
          )}
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
        Add Section
      </NButton>
    </div>
  );
}
