import React, { useEffect, useRef } from "react";
import I18n from "../_commons/I18n";
import { useFieldArray, useForm } from "react-hook-form";
import { CourseSubmit } from "./CourseSubmit";
import { SettingSubmitProps } from "@/models";
import NButton from "../_commons/NButton";
import FormInput from "../_commons/FormInput";

export const CourseTarget: React.FC<SettingSubmitProps> = ({
  moveToNextStep,
}) => {
  const { control, handleSubmit } = useForm();

  const validation = {
    required: "This field is required",
    minLength: {
      value: 20,
      message: "Input must be at least 20 characters long",
    },
  };

  const group1Fields = useFieldArray({ control, name: "group1" });
  const group2Fields = useFieldArray({ control, name: "group2" });
  const group3Fields = useFieldArray({ control, name: "group3" });

  const fieldGroups = [
    {
      name: "group1",
      fields: group1Fields,
      label: "What will students learn in your course?",
      defaultValues: [""],
    },
    {
      name: "group2",
      fields: group2Fields,
      label: "What are the requirements to join your course?",
      defaultValues: [""],
    },
    {
      name: "group3",
      fields: group3Fields,
      label: "Who is this course intended for?",
      defaultValues: [""],
    },
  ];
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true;

      fieldGroups.forEach(({ fields, defaultValues }) => {
        if (fields.fields.length === 0) {
          defaultValues.forEach((value) => fields.append(value));
        }
      });
    }
  }, []);

  const onNext = () => {
    handleSubmit((data) => onSubmit(data, () => moveToNextStep?.()))();
  };

  // const onPrev = () => {
  //   handleSubmit((data) => onSubmit(data, () => moveToPrevStep?.()))();
  // };

  const onSubmit = (data, callback) => {
    callback();
  };

  return (
    <>
      <div className="overflow-auto">
        {fieldGroups.map(({ name, fields, label }) => (
          <div className="form-group" key={name}>
            <label className="large">
              <I18n i18key={label}></I18n>
            </label>
            <div className="space-y-4">
              {fields.fields.map((field, index) => (
                <div key={field.id}>
                  <FormInput
                    name={`${name}.${index}`}
                    control={control}
                    rules={validation}
                    placeholder="Enter your target"
                  />
                </div>
              ))}
            </div>

            <div className="mt-2">
              <NButton
                shape="xxl"
                variant="secondary-gray"
                size="md"
                onClick={() => fields.append("")}
              >
                Add
              </NButton>
            </div>
          </div>
        ))}
      </div>

      <CourseSubmit
        moveToNextStep={onNext}
        cancel={moveToNextStep}
      ></CourseSubmit>
    </>
  );
};
