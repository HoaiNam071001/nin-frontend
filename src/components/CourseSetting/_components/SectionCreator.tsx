"use client";

import DropdownSelect from "@/components/_commons/DropdownSelect";
import FormInput from "@/components/_commons/FormInput";
import NButton from "@/components/_commons/NButton";
import { Course } from "@/models";
import { Section, SectionType } from "@/models/course/section.model";
import { sectionService } from "@/services/section.service";
import { useState } from "react";
import { useForm } from "react-hook-form";

export function SectionCreator({
  parent,
  course,
  onCreate,
}: {
  parent?: Section;
  course: Course;
  onCreate: (e: Section) => void;
}) {
  const {
    control,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Section>({
    defaultValues: {
      name: "",
      type: null,
    },
  });

  const [creating, setCreating] = useState(null);
  const addItem = async (data: Section) => {
    const section: Section = await sectionService.create({
      courseId: course.id,
      name: data.name,
      type: data.type,
      parentId: parent?.id,
    });
    onCreate(section);
    setCreating(false);
  };

  const onCancel = () => {
    setCreating(false);
    reset({
      name: "",
      type: null,
    });
  };

  return (
    <>
      {creating && (
        <div className="border p-4 rounded border-stroke relative shadow-md bg-white">
          <div className="form-group">
            <label>Name</label>
            <FormInput
              name={`name`}
              control={control}
              rules={{
                required: "Name is required",
              }}
              placeholder="Enter Name"
            />
          </div>

          {parent && (
            <>
              <div className="form-group">
                <label>Type</label>
                <div className="w-[200px]">
                  <DropdownSelect
                    control={control}
                    name={"type"}
                    rules={{
                      required: "Type is required",
                    }}
                    bindValue="value"
                    options={[
                      { value: SectionType.Video, name: "Video" },
                      { value: SectionType.Post, name: "Post" },
                    ]}
                    placeholder="Select Type"
                  ></DropdownSelect>
                </div>
              </div>
            </>
          )}

          <div className="space-x-3 flex justify-end">
            <NButton
              className="min-w-[80px]"
              variant="primary-outline"
              onClick={onCancel}
            >
              Cancel
            </NButton>
            <NButton
              className="min-w-[80px]"
              variant="primary"
              onClick={() => handleSubmit((data) => addItem(data))()}
            >
              Add
            </NButton>
          </div>
        </div>
      )}

      {!creating && (
        <NButton
          shape="xxl"
          variant="primary"
          onClick={() => setCreating(true)}
        >
          Add Section
        </NButton>
      )}
    </>
  );
}
