"use client";

import FormInput from "@/components/Form/FormInput";
import I18n from "@/components/_commons/I18n";
import Loader from "@/components/_commons/Loader";
import NButton from "@/components/_commons/NButton";
import { ROUTES } from "@/constants";
import { useI18nRouter } from "@/hooks/useI18nRouter";
import { courseService } from "@/services/courses/course.service";
import { toastService } from "@/services/toast.service";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface FormValues {
  name: string;
  summary: string;
}

const Course: React.FC = () => {
  const { handleSubmit, control } = useForm<FormValues>({
    defaultValues: {
      name: "",
      summary: "",
    },
  });
  const router = useI18nRouter();
  const [loading, setLoading] = useState<boolean>();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await courseService.create({
        name: data?.name,
        summary: data?.summary,
      });
      setLoading(false);
      if (!response) {
        toastService.error("Create course failed");
        return;
      }
      router.push(`${ROUTES.INSTRUCTOR_COURSE}/${response.id}`);
    } catch (error) {
      toastService.error(error?.message || "500 Error");
      setLoading(false);
    }
  };

  return (
    <div className="m-3 h-[80vh] bg-gray-1 rounded-md px-4 py-3 flex">
      <div className="w-[600px] mx-auto my-auto">
        <div className="mb-2">
          <label className="text-title-md">
            What is the name of your course?
          </label>
          <div className="mt-2">
            <FormInput
              name={`name`}
              control={control}
              defaultValue={""}
              rules={{
                required: "Name is required",
              }}
              placeholder="Enter Name"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="overview-summary">Summary</label>
          <FormInput
            name={`summary`}
            control={control}
            defaultValue={""}
            placeholder="Enter brief description of the course"
          />
        </div>

        <div className="flex justify-end mt-4">
          <NButton
            shape="xxl"
            variant="solid"
            color="primary"
            size="md"
            onClick={() => handleSubmit((data) => onSubmit(data))()}
            className="w-[100px]"
          >
            <div className="flex items-center justify-center space-x-2">
              {loading && <Loader color="white" size="sm" />}
              <I18n i18key="Create"></I18n>
            </div>
          </NButton>
        </div>
      </div>
    </div>
  );
};

export default Course;
