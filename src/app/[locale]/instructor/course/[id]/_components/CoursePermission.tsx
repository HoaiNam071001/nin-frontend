"use client";

import I18n from "@/components/_commons/I18n";
import NButton from "@/components/_commons/NButton";
import NUser from "@/components/_commons/NUser";
import SvgIcon from "@/components/_commons/SvgIcon";
import FormSelection from "@/components/Form/FormSelection";
import {
  Course,
  CourseAccess,
  CourseAccessType,
  Instructor,
  InstructorType,
  InstructorTypes,
  SettingSubmitProps,
  ShortUser,
} from "@/models";
import { List2Res } from "@/models/utils.model";
import { useModal } from "@/providers/ModalProvider";
import { courseService } from "@/services/courses/course.service";
import { toastService } from "@/services/toast.service";
import { userService } from "@/services/user/user.service";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

export const CoursePermission: React.FC<SettingSubmitProps> = ({
  moveToNextStep,
  moveToPrevStep,
  course,
  editable,
}) => {
  const [instructors, setInstructors] = useState([]);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const getCourse = async () => {
      try {
        const instructors: Instructor[] = await courseService.getInstructors(
          course.id
        );
        setInstructors(instructors);
      } catch (error) {
        toastService.error(error?.message);
      }
    };
    getCourse();
  }, [course?.id]);

  const onAdd = (item: Instructor) => {
    if (item) {
      instructors.push(item);
      setInstructors([...instructors]);
    }
    setAdding(false);
  };

  const onEdit = (item: Instructor) => {
    const existItem = instructors.find((e) => e.id === item.id);
    if (existItem) {
      Object.assign(existItem, item);
    } else {
      instructors.push(item);
    }
    setInstructors([...instructors]);
  };

  const onRemove = (item: Instructor) => {
    instructors.splice(instructors.indexOf(item), 1);
    setInstructors([...instructors]);
  };

  return (
    <>
      <div className="overflow-auto flex-1 gap-4 flex flex-col">
        <div className="font-semibold">
          <I18n i18key={"Course Collaborator"} />
        </div>
        <div className="border-t border-stroke">
          {instructors.map((instructor) => (
            <CourseInstructor
              key={instructor.id}
              item={instructor}
              disabled={!editable}
              onEdit={onEdit}
              onRemove={onRemove}
            />
          ))}
        </div>
        <div>
          {adding && (
            <div className="flex-1 gap-2 flex flex-col">
              <div className="">New Collaborator</div>
              <div className="border-t border-stroke">
                <CourseInstructor onAdd={onAdd} course={course} />
              </div>
            </div>
          )}
          {editable && !adding && (
            <div>
              <NButton
                shape="md"
                color="primary"
                onClick={() => setAdding(true)}
              >
                Add Collaborator
              </NButton>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const CourseInstructor = ({
  item,
  course,
  disabled,
  onAdd,
  onEdit,
  onRemove,
}: {
  item?: Instructor;
  disabled?: boolean;
  course?: Course;
  onAdd?: (i?: Instructor) => void;
  onEdit?: (i: Instructor) => void;
  onRemove?: (i: Instructor) => void;
}) => {
  const [editing, setEditing] = useState(false);
  const [userList, setUserList] = useState<ShortUser[]>();
  const { setValue, handleSubmit, control, watch, getValues } =
    useForm<Instructor>({
      defaultValues: {
        user: null,
        accessType: CourseAccessType.VIEW,
        type: InstructorType.ASSISTANT,
      },
    });

  const { openConfirm } = useModal();

  const onEditItem = () => {
    const values = {
      user: item.user,
      accessType: item.accessType,
      type: item.type,
    };

    Object.entries(values).forEach(([key, value]) => {
      setValue(key as keyof Instructor, value);
    });

    setEditing(true);
  };

  const onSave = () => {
    handleSubmit(async (data: Instructor) => {
      try {
        if (item) {
          const instructor = await courseService.updateInstructor(item.id, {
            userId: data.user?.id,
            accessType: data.accessType,
            type: data.type,
          });
          onEdit?.(instructor);
          setEditing(false);
          return;
        }
        const instructor = await courseService.addInstructor(course?.id, {
          userId: data.user?.id,
          accessType: data.accessType,
          type: data.type,
        });

        onAdd?.(instructor);
      } catch (error) {
        toastService.error(error.message);
      }
    })();
  };

  const searchUser = async (text: string) => {
    try {
      const { content }: List2Res<ShortUser> = await userService.get(
        {},
        {
          keyword: text,
        }
      );
      setUserList(content);
    } catch (error) {
      setUserList([]);
    }
  };

  const onDelete = () => {
    openConfirm({
      header: "Delete ",
      content: "Are you sure you want to delete this Collaborator?",
      onOk: async () => {
        try {
          await courseService.removeInstructor(item.id);
          onRemove?.(item);
        } catch (error) {
          toastService.error(error.message);
        }
      },
      onCancel: () => {},
    });
  };

  const UserLabel = (val: ShortUser) => (
    <NUser src={val.avatar} name={val.fullName} email={val.email} />
  );

  const editMode = !item || editing;

  const currentType = () => {
    return InstructorTypes.find((e) => e.value === item.type)?.name;
  };

  const currentLevel = () => {
    return CourseAccess.find((e) => e.value === item.accessType)?.name;
  };
  const type = watch("type");
  const mainType = [InstructorType.CO_INSTRUCTOR, InstructorType.PRIMARY];

  const isDisableType = useMemo(() => {
    return mainType.includes(type);
  }, [type]);
  const accessType = watch("accessType");
  useEffect(() => {
    if (editMode && mainType.includes(type)) {
      setValue("accessType", CourseAccessType.EDIT);
    }
  }, [type]);

  return (
    <div className="flex items-center p-1 border-b border-stroke hover:bg-[var(--n-row-hover)]">
      {!editMode && (
        <>
          <div className="flex-1">
            <NUser
              src={item.user.avatar}
              tooltip=""
              name={item.user?.fullName}
              email={item.user?.email}
            />
          </div>
          <div className="flex-1">{currentType()}</div>
          <div className="flex-[0.5]">{currentLevel()}</div>
          {!disabled && (
            <div>
              <div className="flex items-center justify-center gap-2">
                <NButton
                  size="sm"
                  variant="filled"
                  onClick={() => onEditItem()}
                >
                  <SvgIcon icon={"edit"} className="icon icon-sm" />
                </NButton>
                <NButton
                  size="sm"
                  variant="filled"
                  color="red"
                  onClick={() => onDelete()}
                >
                  <SvgIcon icon={"remove"} className="icon icon-sm" />
                </NButton>
              </div>
            </div>
          )}
        </>
      )}

      {editMode && (
        <>
          <div className="flex-1">
            <FormSelection
              control={control}
              rules={{
                required: "User is required",
              }}
              name={"user"}
              searchOnFirstOpen={true}
              dropdownWidth={"250px"}
              searchable={true}
              onSearch={(keyword) => searchUser(keyword)}
              options={userList}
              renderLabel={UserLabel}
              renderOption={UserLabel}
              placeholder="Select User"
            ></FormSelection>
          </div>
          <div className="flex-1">
            <FormSelection
              control={control}
              name={"type"}
              bindLabel="name"
              bindValue="value"
              dropdownWidth={"fit-content"}
              options={InstructorTypes}
            ></FormSelection>
          </div>
          <div className="flex-[0.5]">
            {!isDisableType ? (
              <FormSelection
                control={control}
                name={"accessType"}
                bindLabel="name"
                bindValue="value"
                options={CourseAccess}
              ></FormSelection>
            ) : (
              <div className=" px-3">{accessType}</div>
            )}
          </div>
          {!disabled && (
            <div className="flex flex-col">
              <NButton shape="sm" variant={"text"} onClick={onSave}>
                <SvgIcon className="icon icon-sm" icon="check" />
              </NButton>
              <NButton
                shape="sm"
                color={"red"}
                variant={"text"}
                onClick={() => (item ? setEditing(false) : onAdd())}
              >
                <SvgIcon className="icon icon-sm" icon="close" />
              </NButton>
            </div>
          )}
        </>
      )}
    </div>
  );
};
