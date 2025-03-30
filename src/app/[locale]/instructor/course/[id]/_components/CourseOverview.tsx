import FormInput from "@/components/Form/FormInput";
import FormSelection from "@/components/Form/FormSelection";
import CustomImage from "@/components/_commons/CustomImage";
import FileUpload from "@/components/_commons/FileUpload";
import NEditor from "@/components/_commons/NEditor";
import SearchWithDropdown from "@/components/_commons/SearchWidthDropdown";
import { DEFAULT_COURSE_THUMBNAIL } from "@/constants/consts/course";
import { upsertItem } from "@/helpers";
import {
  Category,
  Course,
  CoursePayload,
  Level,
  SettingSubmitProps,
  Topic,
} from "@/models";
import { NFile, SystemFileType, UploadFilePayload } from "@/models/file.model";
import { categoryService } from "@/services/courses/category.service";
import { courseService } from "@/services/courses/course.service";
import { levelService } from "@/services/courses/level.service";
import { topicService } from "@/services/courses/topic.service";
import { fileService } from "@/services/file.service";
import { toastService } from "@/services/toast.service";
import { map } from "lodash";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { CourseSubmit } from "./CourseSubmit";

interface OverviewFormValues {
  name: string;
  description: string;
  level: Level;
  category: Category;
  subCategory: Category;
  topics: Topic[];
  thumbnail: string;
  summary: string;
}

export const CourseOverview: React.FC<SettingSubmitProps> = ({
  moveToNextStep,
  course,
  editable,
  setCourse,
}) => {
  const { handleSubmit, control, setValue, getValues, watch } =
    useForm<OverviewFormValues>({
      defaultValues: {
        name: course?.name || "",
        description: course?.description,
        level: course?.level,
        category: course?.category,
        subCategory: course?.subCategory,
        topics: course?.topics || [],
        thumbnail: course?.thumbnail,
        summary: course?.summary,
      },
    });
  const [loading, setLoading] = useState<boolean>(false);

  const onNext = () => {
    handleSubmit((data) => onSubmit(data, () => moveToNextStep?.()))();
  };

  const onSubmit = async (data: OverviewFormValues, callback) => {
    try {
      const payload: CoursePayload = {
        name: data.name,
        description: data.description,
        thumbnail: data.thumbnail,
        levelId: data.level?.id,
        categoryId: data.category?.id,
        subCategoryId: data.subCategory?.id,
        topicIds: map(data.topics, (e) => e.id),
        summary: data.summary,
      };
      setLoading(true);
      const response: Course = await courseService.update(course.id, payload);
      setCourse(response);
      setLoading(false);
      toastService.success("Updated successfully");
    } catch (error) {
      toastService.error(error?.message);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="">
        <Thumbnail control={control} setValue={setValue} editable={editable} />

        <div className="form-group">
          <label htmlFor="overview-name">Name</label>
          <FormInput
            name={`name`}
            control={control}
            defaultValue={""}
            disabled={!editable}
            rules={{
              required: "Name is required",
            }}
            placeholder="Enter the name of the course"
          />
        </div>

        <div className="form-group">
          <label htmlFor="overview-summary">Summary</label>
          <FormInput
            name={`summary`}
            control={control}
            disabled={!editable}
            defaultValue={""}
            placeholder="Enter brief description of the course"
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <Controller
            name="description"
            control={control}
            disabled={!editable}
            render={({ field }) => (
              <NEditor
                value={field.value}
                onChange={field.onChange}
                editable={editable}
              />
            )}
          />
        </div>

        <BasicInfo control={control} watch={watch} editable={editable} />

        <TopicInfo
          control={control}
          getValues={getValues}
          setValue={setValue}
          editable={editable}
        />
      </div>
      {/* Submit Button */}
      {editable && (
        <CourseSubmit
          moveToNextStep={onNext}
          nextLabel={"Save"}
          disabled={!editable}
          cancel={moveToNextStep}
          loading={loading}
        ></CourseSubmit>
      )}
    </>
  );
};

const BasicInfo = ({ control, watch, editable }) => {
  const [levels, setLevels] = useState<Level[]>();
  const [categories, setCategories] = useState<Category[]>();
  const [subCategories, setSubcategories] = useState<Category[]>();
  // const [topics, setTopic] = useState<Topic[]>();
  const [categorySearch, setCategorySearch] = useState<string>();
  const [subCategorySearch, setSubCategorySearch] = useState<string>();

  const category = watch("category");

  const getCategory = async (keyword?: string) => {
    try {
      const response = await categoryService.getRoot({ keyword });
      setCategories(response.content);
    } catch (error) {
      setCategories([]);
    }
  };

  // get level
  useEffect(() => {
    const getLevel = async () => {
      try {
        const response: Level[] = await levelService.get();
        setLevels(response);
      } catch (error) {
        setLevels([]);
      }
    };
    getLevel();
  }, []);

  // get category
  useEffect(() => {
    getCategory();
  }, []);

  useEffect(() => {
    getCategory(categorySearch);
  }, [categorySearch]);

  useEffect(() => {
    const getSubCategory = async (category: Category, keyword?: string) => {
      try {
        if (!category) {
          setSubcategories([]);
          return;
        }
        const response: Category[] = (
          await categoryService.getChildren(category?.id, { keyword })
        ).content;
        setSubcategories(response);
      } catch (error) {
        setSubcategories([]);
      }
    };
    getSubCategory(category);
  }, [category, subCategorySearch]);

  return (
    <>
      <div className="form-group">
        <label>Basic Info</label>
        <div className="flex space-x-3">
          <FormSelection
            control={control}
            name={"level"}
            options={levels}
            disabled={!editable}
            className="flex-1"
            placeholder="Select Level"
          ></FormSelection>
          <FormSelection
            control={control}
            name={"category"}
            options={categories}
            className="flex-1"
            disabled={!editable}
            onSearch={(value) => setCategorySearch(value)}
            placeholder="Select Category"
            searchable={true}
          ></FormSelection>
          <FormSelection
            control={control}
            name={"subCategory"}
            searchable={true}
            options={subCategories}
            className="flex-1"
            disabled={!editable}
            onSearch={(value) => setSubCategorySearch(value)}
            placeholder="Select SubCategory"
          ></FormSelection>
        </div>
      </div>
    </>
  );
};

const TopicInfo = ({ control, getValues, setValue, editable }) => {
  const handleAddTag = (value) => {
    const items = getValues?.("topics") || [];
    setValue("topics", upsertItem(items, value, "id"));
  };

  const handleRemoveTag = (topic: Topic) => {
    const currentTags: Topic[] = getValues("topics");
    setValue(
      "topics",
      currentTags.filter((tag) => tag.id !== topic.id)
    );
  };

  const getTopics = async (keyword: string) => {
    // fetch topics from API
    const data = await topicService.get({ keyword });
    return data.content;
  };
  return (
    <div className="form-group">
      <label>What is the course about?</label>
      <SearchWithDropdown
        apiCall={getTopics}
        bindLabel="name"
        disabled={!editable}
        onSelect={handleAddTag}
      ></SearchWithDropdown>

      <div className="min-h-[50px] mt-4">
        <Controller
          name="topics"
          control={control}
          disabled={!editable}
          render={({ field }) =>
            field.value?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {field.value.map((topic, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between px-3 py-1 bg-blue-200 text-blue-800 rounded-full"
                  >
                    <span>{topic?.name}</span>
                    {editable && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(topic)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        &times;
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-gray-500"></span>
            )
          }
        />
      </div>
    </div>
  );
};

const Thumbnail = ({ control, setValue, editable }) => {
  const uploadFile = async (file: File) => {
    const payload: UploadFilePayload = {
      file: file,
      type: SystemFileType.COURSE_INFO,
    };
    const fileRes: NFile = await fileService.upload(payload);
    setValue("thumbnail", fileRes.url);
  };

  return (
    <div className="flex items-center justify-center gap-2 mb-2 relative group">
      <Controller
        name="thumbnail"
        control={control}
        disabled={!editable}
        render={({ field }) => (
          <CustomImage
            src={field.value || DEFAULT_COURSE_THUMBNAIL}
            alt="preview"
            className="w-[250px] h-[140px] rounded-lg border-stroke border"
          />
        )}
      />
      {editable && (
        <div className="bg-white bg-opacity-20 absolute top-0 left-0 invisible group-hover:visible w-full h-full flex items-center justify-center">
          <FileUpload
            label={"Upload"}
            upload={uploadFile}
            width={500}
            height={300}
          ></FileUpload>
        </div>
      )}
    </div>
  );
};
