"use client";

import React, { useEffect, useRef, useState } from "react";
import I18n from "../_commons/I18n";
import { useFieldArray, UseFieldArrayReturn, useForm } from "react-hook-form";
import { CourseTarget, CourseTargetType, SettingSubmitProps } from "@/models";
import NButton from "../_commons/NButton";
import FormInput from "../_commons/FormInput";
import { targetService } from "@/services/target.service";
import { toastService } from "@/services/toast.service";
import { forEach } from "lodash";
import SvgIcon from "../_commons/SvgIcon";
import { Button } from "antd";
import Loader from "../_commons/Loader";

export const CourseTargetComponent: React.FC<SettingSubmitProps> = ({
  moveToNextStep,
  course,
}) => {
  const { control, setValue, handleSubmit } = useForm();
  const [loading, setLoading] = useState<boolean>(true);
  const defaultValuesRef = useRef({
    [CourseTargetType.achieved]: [""],
    [CourseTargetType.requirement]: [""],
    [CourseTargetType.object]: [""],
  });
  const validation = {
    required: "This field is required",
    minLength: {
      value: 10,
      message: "Input must be at least 10 characters long",
    },
    maxLength: {
      value: 255,
      message: "Input must be at most 255 characters long",
    },
  };

  const group1Fields = useFieldArray({
    control,
    name: CourseTargetType.achieved,
  });
  const group2Fields = useFieldArray({
    control,
    name: CourseTargetType.requirement,
  });
  const group3Fields = useFieldArray({
    control,
    name: CourseTargetType.object,
  });

  const fieldGroups = [
    {
      name: CourseTargetType.achieved,
      fields: group1Fields,
      label: "What will students learn in your course?",
      placeholder: "Ex: Create and manage advertising campaigns on Facebook.",
      defaultValues: [""],
    },
    {
      name: CourseTargetType.requirement,
      fields: group2Fields,
      label: "What are the requirements to join your course?",
      placeholder: "Ex: Have a computer and stable internet connection.",
      defaultValues: [""],
    },
    {
      name: CourseTargetType.object,
      fields: group3Fields,
      label: "Who is this course intended for?",
      placeholder: "Ex: Student or working person.",
      defaultValues: [""],
    },
  ];
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true;

      fieldGroups.forEach(({ fields, name }) => {
        const defaultValues = defaultValuesRef.current[name];

        if (fields.fields.length === 0) {
          defaultValues.forEach((value) => fields.append(value));
        }
      });
    }
  }, []);

  const fetchTargets = async () => {
    try {
      setLoading(true);
      const targets: CourseTarget[] = await targetService.getByCourse(
        course.id
      );

      targets.forEach((target) => {
        const items = target.content ? JSON.parse(target.content) : [];
        const group = fieldGroups.find((g) => g.name === target.type);

        if (group) {
          setValue(group.name, items);
          group.fields.replace(items);
          defaultValuesRef.current[target.type] = items; // Update default values
        }
      });

      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (course) {
      fetchTargets();
    }
  }, [course]);

  const onSave = () => {
    handleSubmit((data) => onSubmit(data, () => moveToNextStep?.()))();
  };

  const onCancel = () => {
    fieldGroups.forEach(({ name }) => {
      const defaultValues = defaultValuesRef.current[name];
      setValue(name, defaultValues); // Reset to stored default values
    });
  };

  const addItem = (type: CourseTargetType) => {
    let groupFields;
    switch (type) {
      case CourseTargetType.achieved:
        groupFields = group1Fields;
        break;
      case CourseTargetType.requirement:
        groupFields = group2Fields;
        break;
      case CourseTargetType.object:
        groupFields = group3Fields;
        break;
      default:
        return;
    }
    groupFields.append("");
  };

  const onSubmit = async (data, callback) => {
    try {
      setLoading(true);
      const payload: CourseTarget[] = [];
      payload.push(
        {
          type: CourseTargetType.achieved,
          content: JSON.stringify(data[CourseTargetType.achieved] || []),
        },
        {
          type: CourseTargetType.requirement,
          content: JSON.stringify(data[CourseTargetType.requirement] || []),
        },
        {
          type: CourseTargetType.object,
          content: JSON.stringify(data[CourseTargetType.object] || []),
        }
      );
      await targetService.update(course.id, { payload });
      setLoading(false);
    } catch (error) {
      toastService.error(error?.message);
      setLoading(false);
    }
    callback();
  };

  return (
    <>
      <div className="overflow-auto">
        {fieldGroups.map(({ name, fields, label, placeholder }) => (
          <div className="form-group" key={name}>
            <label className="large">
              <I18n i18key={label}></I18n>
            </label>
            <div className="space-y-4">
              {fields.fields.map((field, index) => (
                <div className="relative group" key={field.id}>
                  <FormInput
                    name={`${name}.${index}`}
                    control={control}
                    rules={validation}
                    addonAfter={
                      <>
                        {fields.fields.length > 1 && (
                          <Button
                            onClick={() => fields.remove(index)}
                            className="p-0 bg-transparent border-0 hover:!text-red absolute right-3 top-1 hidden group-hover:block"
                          >
                            <SvgIcon className="icon icon-sm" icon="close" />
                          </Button>
                        )}
                      </>
                    }
                    placeholder={placeholder}
                  />
                </div>
              ))}
            </div>

            <div className="mt-2">
              {fields.fields.length < 5 && (
                <NButton
                  shape="xxl"
                  variant="secondary-gray"
                  size="md"
                  onClick={() => addItem(name)}
                >
                  Add
                </NButton>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto flex justify-end gap-4 pt-3">
        {loading && <Loader />}
        <NButton
          shape="md"
          variant="secondary-black"
          size="md"
          onClick={onCancel}
        >
          <I18n i18key="Cancel"></I18n>
        </NButton>

        <NButton
          shape="md"
          variant="primary"
          size="md"
          onClick={onSave}
          className="w-[100px]"
        >
          <I18n i18key={"Save"}></I18n>
        </NButton>
      </div>
    </>
  );
};
