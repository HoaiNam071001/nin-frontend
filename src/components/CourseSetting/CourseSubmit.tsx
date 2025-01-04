import React from "react";
import I18n from "../_commons/I18n";
import { SettingSubmitProps } from "@/models";
import NButton from "../_commons/NButton";
import Loader from "../_commons/Loader";

interface CourseSubmitProps extends SettingSubmitProps {
  nextLabel?: string;
  prevLabel?: string;
  loading?: boolean;
}

export const CourseSubmit: React.FC<CourseSubmitProps> = ({
  moveToNextStep,
  moveToPrevStep,
  cancel,
  nextLabel = "Next",
  prevLabel = "Prev",
  loading,
}) => {
  return (
    <div className="sticky bottom-0 bg-white pt-4 flex justify-end gap-4 mt-auto">
      {loading && <Loader />}
      {cancel && <NButton shape="md" variant="secondary-black" size="md" onClick={cancel}>
        <I18n i18key="Cancel"></I18n>
      </NButton>}
      {moveToPrevStep && (
        <NButton
          shape="md"
          variant="primary-outline"
          size="md"
          onClick={moveToPrevStep}
          className="w-[100px]"
        >
          <I18n i18key={prevLabel}></I18n>
        </NButton>
      )}
      {moveToNextStep && (
        <NButton
          shape="md"
          variant="primary"
          size="md"
          onClick={moveToNextStep}
          className="w-[100px]"
        >
          <I18n i18key={nextLabel}></I18n>
        </NButton>
      )}
    </div>
  );
};
