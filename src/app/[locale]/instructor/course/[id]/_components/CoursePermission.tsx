import { useForm } from "react-hook-form";
import { CourseSubmit } from "./CourseSubmit";
import { Empty } from "antd";
import { SettingSubmitProps } from '@/models';


export const CoursePermisison: React.FC<SettingSubmitProps> = ({
  moveToNextStep,
  moveToPrevStep,
}) => {
  const { handleSubmit } = useForm({
    defaultValues: {},
  });

  const onNext = () => {
    handleSubmit((data) => onSubmit(data, () => moveToNextStep?.()))();
  };

  const onPrev = () => {
    handleSubmit((data) => onSubmit(data, () => moveToPrevStep?.()))();
  };

  const onSubmit = (data, callback) => {
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
