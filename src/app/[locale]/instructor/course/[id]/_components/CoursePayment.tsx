"use client";

import I18n from "@/components/_commons/I18n";
import NButton from "@/components/_commons/NButton";
import NInput from "@/components/_commons/NInput";
import { Course, CoursePayload, SettingSubmitProps } from "@/models";
import { toastService } from "@/services/toast.service";
import { useEffect, useState } from "react";
import { DiscountManager } from "./DiscountManager";
import { courseService } from "@/services/courses/course.service";

export const CoursePayment: React.FC<SettingSubmitProps> = ({
  moveToNextStep,
  moveToPrevStep,
  course,
  setCourse,
}) => {
  const [price, setPrice] = useState<number>(0);

  useEffect(() => {
    setPrice(course.price || 0);
  }, [course]);

  const onSubmit = async () => {
    try {
      const payload: CoursePayload = {
        price: +price,
      };
      const response: Course = await courseService.update(course.id, payload);
      setCourse(response);
      toastService.success("Updated successfully");
    } catch (error) {
      toastService.error(error?.message);
    }
  };

  return (
    <>
      <div className="overflow-auto flex-1 gap-4 flex flex-col">
        <div className="font-semibold mb-2">
          <I18n i18key={"Course price"} />
        </div>
        <div className="flex items-center gap-2">
          <NInput
            type="number"
            value={price}
            min={0}
            onValueChange={(value) => {
              setPrice((value as number) || 0);
            }}
          />
          <div>VNĐ</div>
          {price == 0 && (
            <div className="px-2 rounded-md bg-red text-white">
              <I18n i18key={"Free"}></I18n>
            </div>
          )}

          <div className="ml-auto">
          <NButton
            shape="md"
            variant="solid"
            color="primary"
            size="md"
            onClick={onSubmit}
            className="w-[100px]"
          >
            <I18n i18key={"Save"}></I18n>
          </NButton>
          </div>
          
        </div>

        <DiscountManager course={course} />
      </div>
    </>
  );
};
