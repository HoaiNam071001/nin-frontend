import { CourseSectionItem, SettingSubmitProps } from "@/models";
import { useForm } from "react-hook-form";
import { CourseSubmit } from "./CourseSubmit";
import { Empty } from "antd";

type FormValues = {
  root: CourseSectionItem[];
};

export const CoursePermisison: React.FC<SettingSubmitProps> = ({
  moveToNextStep,
  moveToPrevStep,
}) => {
  const { handleSubmit } = useForm<FormValues>({
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

  return (
    <>
      <div className="overflow-auto">
        <Empty />
      </div>

      <CourseSubmit
        moveToNextStep={onNext}
        moveToPrevStep={onPrev}
        cancel={moveToNextStep}
      ></CourseSubmit>
    </>
  );
};
