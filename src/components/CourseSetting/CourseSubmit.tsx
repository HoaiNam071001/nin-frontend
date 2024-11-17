import React from "react";
import I18n from "../_commons/I18n";
import { SettingSubmitProps } from "@/models";

interface CourseSubmitProps extends SettingSubmitProps {
  nextLabel?: string;
  prevLabel?: string;
}

export const CourseSubmit: React.FC<CourseSubmitProps> = ({
  moveToNextStep,
  moveToPrevStep,
  cancel,
  nextLabel = "Next",
  prevLabel = "Prev",
}) => {
  return (
    <div className="flex justify-end gap-2 px-5">
      <button onClick={cancel}>
        <I18n i18key="Cancel"></I18n>
      </button>
      {moveToPrevStep && (
        <button onClick={moveToPrevStep}>
          <I18n i18key={prevLabel}></I18n>
        </button>
      )}
      {moveToNextStep && (
        <button onClick={moveToNextStep}>
          <I18n i18key={nextLabel}></I18n>
        </button>
      )}
    </div>
  );
};
