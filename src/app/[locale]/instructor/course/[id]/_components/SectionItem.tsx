import NButton from "@/components/_commons/NButton";
import SvgIcon from "@/components/_commons/SvgIcon";
import { Course } from "@/models";
import { Section, SectionContent } from "@/models/course/section.model";
import { sectionService } from "@/services/courses/section.service";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { SectionOptions } from "./SectionOptions";
import FormInput from "@/components/Form/FormInput";
import Loader from "@/components/_commons/Loader";
import { SectionFileContent } from "./SectionFileContent";
import { SectionCreator } from "./SectionCreator";
import HMSDisplay from "@/components/_commons/HMSDisplay";
import FormTimeInput from "@/components/Form/FormTimeInput";

export function SectionItem({
  item,
  course,
  parent,
  indexes,
  onAddSection,
  onEditSection,
  onDeleteSection,
}: {
  item?: Section;
  course: Course;
  parent?: Section;
  indexes: number[];
  onAddSection: (section: Section, parent?: Section) => void;
  onEditSection: (original: Section, section: Section) => void;
  onDeleteSection: (sectionId: number, parent?: Section) => void;
}) {
  const [expanded, setExpand] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [editing, setEdit] = useState<boolean>(false);
  const [content, setContent] = useState<SectionContent>(null);
  const { control, getValues, handleSubmit, setValue } = useForm<Section>({
    defaultValues: {
      id: item.id,
      name: item?.name || "",
      description: item?.description || "",
      estimatedTime: item?.estimatedTime,
      type: item?.type,
    },
  });

  useEffect(() => {
    setContent({ ...content, ...item });
  }, [item]);

  const getContent = async () => {
    if (content) {
      return;
    }
    const data: SectionContent = await sectionService.getContent(item.id);
    setContent(data);
  };

  const onEdit = () => {
    handleSubmit(async (data: Section) => {
      setLoading(true);
      const newSection: Section = await sectionService.update(item.id, {
        name: data.name,
        description: data.description,
        estimatedTime: data.estimatedTime,
        type: data.type,
      });
      onEditSection(item, newSection);
      setLoading(false);
      switchModeEdit(false);
    })();
  };

  const onResetSectionContent = (content: SectionContent) => {
    setContent(content);
    onEditSection(item, content);
  };

  const switchModeEdit = (isEdit: boolean) => {
    setEdit(isEdit);
    if (isEdit) {
      const newValues: Section = {
        id: item.id,
        name: item.name,
        description: item.description,
        estimatedTime: item.estimatedTime,
        type: item.type,
      };

      Object.keys(newValues).forEach((key) => {
        setValue(key as keyof Section, newValues[key as keyof Section]);
      });
    }
  };
  const onRemove = async () => {
    setLoading(true);
    await sectionService.remove(item.id);
    setLoading(false);
    onDeleteSection(item.id, parent);
  };

  const onToggle = async () => {
    const _expanded = !expanded;
    setExpand(_expanded);
    if (_expanded) {
      getContent();
    }
  };

  return (
    <div
      className={`${
        !parent ? "bg-slate-100" : "bg-white"
      } border p-3 rounded border-stroke relative shadow-md`}
    >
      <div className="border bg-white border-stroke p-2 rounded ">
        {!editing && (
          <div className="flex items-center">
            <NButton
              shape="xxl"
              variant="link"
              size="sm-circle"
              className="mr-2 hover:bg-slate-100"
              onClick={onToggle}
            >
              <SvgIcon
                icon="arrow"
                className={`icon icon-sm ${
                  expanded ? "rotate-180" : "rotate-90"
                }`}
              ></SvgIcon>
            </NButton>
            <div
              className="text-title-sm mr-2 cursor-pointer"
              onClick={onToggle}
            >
              <span className="font-semibold">{indexes.join(".")}. </span>{" "}
              {getValues("name")}{" "}
              {item?.estimatedTime && (
                <span className="text-secondary">
                  (<HMSDisplay seconds={item?.estimatedTime} />)
                </span>
              )}
            </div>
            <div className="ml-auto">
              <SectionOptions
                deleteMessage="Are you sure to delete this Section?"
                onRemove={onRemove}
                onEdit={() => switchModeEdit(true)}
              />
            </div>
          </div>
        )}
        {editing && (
          <>
            <div className="form-group">
              <label>Name</label>
              <FormInput
                name={`name`}
                control={control}
                rules={{
                  required: "Name is required",
                }}
                placeholder="Enter Name"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <FormInput
                name={`description`}
                control={control}
                placeholder="Enter Description"
              />
            </div>
            {parent && (
              <div className="form-group">
                <label>Estimated Time</label>
                <FormTimeInput name={`estimatedTime`} control={control} />
              </div>
            )}

            <div className="space-x-3 flex justify-end">
              <NButton
                className="min-w-[80px]"
                variant="outlined"
                onClick={() => switchModeEdit(false)}
              >
                Cancel
              </NButton>
              <NButton className="min-w-[80px] relative" onClick={onEdit}>
                {loading && (
                  <span className="absolute left-0">
                    <Loader color="white" size="xs" />
                  </span>
                )}
                Save
              </NButton>
            </div>
          </>
        )}
      </div>

      {parent && expanded && (
        <div className="pt-2">
          <SectionFileContent
            section={item}
            content={content}
            setContent={(value) => onResetSectionContent(value)}
          />
        </div>
      )}

      <div
        className=""
        style={{
          display: expanded ? "block" : "none",
        }}
      >
        {item.childrens?.map((e, index) => (
          <div key={index} className="mt-4">
            <SectionItem
              course={course}
              item={e}
              indexes={[...indexes, index + 1]}
              parent={item}
              onDeleteSection={onDeleteSection}
              onEditSection={onEditSection}
              onAddSection={onAddSection}
            ></SectionItem>
          </div>
        ))}
        {!parent && (
          <div className="mt-4">
            <SectionCreator
              parent={item}
              course={course}
              onCreate={(newSection) => onAddSection(newSection, item)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
