import React from "react";

import I18n from "@/components/_commons/I18n";
import Loader from "@/components/_commons/Loader";
import NButton from "@/components/_commons/NButton";
import { SettingSubmitProps } from "@/models";

interface CourseSubmitProps extends SettingSubmitProps {
  nextLabel?: string;
  prevLabel?: string;
  loading?: boolean;
  disabled?: boolean;
}

export const CourseSubmit: React.FC<CourseSubmitProps> = ({
  moveToNextStep,
  moveToPrevStep,
  cancel,
  nextLabel = "Next",
  prevLabel = "Prev",
  loading,
  disabled,
}) => {
  return (
    <div className="sticky bottom-0 bg-white pt-4 flex justify-end gap-4 mt-auto">
      {loading && <Loader />}
      {cancel && (
        <NButton
          shape="md"
          variant="outlined"
          color="secondary"
          size="md"
          onClick={cancel}
          disabled={disabled}
        >
          <I18n i18key="Cancel"></I18n>
        </NButton>
      )}
      {moveToPrevStep && (
        <NButton
          shape="md"
          variant="outlined"
          color="primary"
          size="md"
          onClick={moveToPrevStep}
          className="w-[100px]"
          disabled={disabled}
        >
          <I18n i18key={prevLabel}></I18n>
        </NButton>
      )}
      {moveToNextStep && (
        <NButton
          shape="md"
          variant="solid"
          color="primary"
          size="md"
          onClick={moveToNextStep}
          className="w-[100px]"
          disabled={disabled}
        >
          <I18n i18key={nextLabel}></I18n>
        </NButton>
      )}
    </div>
  );
};
