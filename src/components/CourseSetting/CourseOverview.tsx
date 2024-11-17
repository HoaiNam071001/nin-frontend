import React from "react";
import { Controller, useForm } from "react-hook-form";
import { CourseSubmit } from "./CourseSubmit";
import { SettingSubmitProps } from "@/models";
import DropdownSelect from "../_commons/DropdownSelect";
import NEditor from "../_commons/NEditor";
import { upsertItem } from "@/utils/arrayUtils";
import FileUpload from "../_commons/FileUpload";
import FormInput from "../_commons/FormInput";
import NInput from "../_commons/NInput";

interface OverviewFormValues {
  name: string;
  description: string;
  overview: string;
  level: any;
  category: any;
  subCategory: any;
  tag: string[];
  tempTag: string;
}

const items = [
  {
    name: "High",
    id: 1,
  },
  {
    name: "Low",
    id: 2,
  },
  {
    name: "Medium",
    id: 3,
  },
];

const categories = [
  {
    name: "develop",
    id: 1,
  },
  {
    name: "AI",
    id: 2,
  },
  {
    name: "Data",
    id: 3,
  },
];

export const CourseOverview: React.FC<SettingSubmitProps> = ({
  moveToNextStep,
  moveToPrevStep,
}) => {
  const { handleSubmit, control, setValue, getValues } =
    useForm<OverviewFormValues>({
      defaultValues: {},
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

  const handleAddTag = () => {
    const tempTag = getValues("tempTag");
    if (tempTag.trim() !== "") {
      const items = getValues?.("tag") || [];
      setValue("tag", upsertItem(items, tempTag.trim()));
      setValue("tempTag", "");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = getValues("tag");
    setValue(
      "tag",
      currentTags.filter((tag) => tag !== tagToRemove)
    );
  };

  return (
    <>
      <div className="form-group">
        <label htmlFor="overview-name">Name</label>
        <FormInput
          name={`name`}
          control={control}
          defaultValue={""}
          rules={{
            required: "Name is required",
          }}
          placeholder="Enter your target"
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <NEditor value={field.value} onChange={field.onChange} />
          )}
        />
      </div>

      <div className="form-group">
        <label>Overview</label>
        <Controller
          name="overview"
          control={control}
          render={({ field }) => (
            <NEditor value={field.value} onChange={field.onChange} />
          )}
        />
      </div>

      <div className="form-group">
        <label>Basic Info</label>
        <div className="flex space-x-3">
        <DropdownSelect
          control={control}
          name={"level"}
          options={items}
          placeholder="Select Level"
        ></DropdownSelect>
        <DropdownSelect
          control={control}
          name={"category"}
          options={categories}
          searchable={true}
          placeholder="Select Category"
        ></DropdownSelect>
        <DropdownSelect
          control={control}
          name={"subCategory"}
          searchable={true}
          options={categories}
          placeholder="Select SubCategory"
        ></DropdownSelect>
        </div>

      </div>

      <div className="form-group">
        <label>What is the course about?:</label>
        <Controller
          name={`tempTag`}
          control={control}
          defaultValue={""}
          render={({ field }) => (
            <>
              <NInput
                id={`tempTag`}
                value={field.value}
                onValueChange={field.onChange}
                keyDown={handleKeyDown}
                placeholder="Enter your target"
              />
            </>
          )}
        />
        <div className="min-h-[50px] mt-4">
          <Controller
            name="tag"
            control={control}
            render={({ field }) =>
              field.value?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {field.value.map((tag, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between px-3 py-1 bg-blue-200 text-blue-800 rounded-full"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-gray-500"></span>
              )
            }
          />
        </div>
      </div>

      <div>
        <FileUpload></FileUpload>
      </div>

      {/* Submit Button */}
      <CourseSubmit
        moveToNextStep={onNext}
        moveToPrevStep={onPrev}
        cancel={moveToNextStep}
      ></CourseSubmit>
    </>
  );
};
