import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { CourseSubmit } from "./CourseSubmit";
import {
  Category,
  Course,
  CoursePayload,
  Level,
  SettingSubmitProps,
  Topic,
} from "@/models";
import DropdownSelect from "../_commons/DropdownSelect";
import NEditor from "../_commons/NEditor";
import { upsertItem } from "@/helpers";
import FileUpload from "../_commons/FileUpload";
import FormInput from "../_commons/FormInput";
import { map } from "lodash";
import { levelService } from "@/services/level.service";
import { categoryService } from "@/services/category.service";
import { courseService } from "@/services/course.service";
import { toastService } from "@/services/toast.service";
import SearchWithDropdown from "../_commons/SearchWidthDropdown";
import { topicService } from "@/services/topic.service";
import {
  NFile,
  SystemFileType,
  UploadFilePayload,
} from "@/models/file.model";
import { fileService } from "@/services/file.service";
import CustomImage from "../_commons/CustomImage";

interface OverviewFormValues {
  name: string;
  description: string;
  level: Level;
  category: Category;
  subCategory: Category;
  topics: Topic[];
  thumbnail: string;
}

export const CourseOverview: React.FC<SettingSubmitProps> = ({
  moveToNextStep,
  moveToPrevStep,
  course,
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
      },
    });
  const [loading, setLoading] = useState<boolean>(false);

  const onNext = () => {
    handleSubmit((data) => onSubmit(data, () => moveToNextStep?.()))();
  };

  const onPrev = () => {
    handleSubmit((data) => onSubmit(data, () => moveToPrevStep?.()))();
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
      };
      setLoading(true);
      const response: Course = await courseService.update(course.id, payload);
      setCourse(response);
      setLoading(false);
    } catch (error) {
      toastService.error(error?.message);
      setLoading(false);
    }
    callback();
  };

  return (
    <>
      <div className="">
        <div className="form-group">
          <label htmlFor="overview-name">Name</label>
          <FormInput
            name={`name`}
            control={control}
            defaultValue={""}
            rules={{
              required: "Name is required",
            }}
            placeholder="Enter your target"
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <NEditor value={field.value} onChange={field.onChange} />
            )}
          />
        </div>

        <BasicInfo control={control} watch={watch} />

        <TopicInfo
          control={control}
          getValues={getValues}
          setValue={setValue}
        />

        <Thumbnail control={control} setValue={setValue} />
      </div>
      {/* Submit Button */}
      <CourseSubmit
        moveToNextStep={onNext}
        moveToPrevStep={onPrev}
        cancel={moveToNextStep}
        loading={loading}
      ></CourseSubmit>
    </>
  );
};

const BasicInfo = ({ control, watch }) => {
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
          <DropdownSelect
            control={control}
            name={"level"}
            options={levels}
            placeholder="Select Level"
          ></DropdownSelect>
          <DropdownSelect
            control={control}
            name={"category"}
            options={categories}
            onSearch={(value) => setCategorySearch(value)}
            placeholder="Select Category"
            searchable={true}
          ></DropdownSelect>
          <DropdownSelect
            control={control}
            name={"subCategory"}
            searchable={true}
            options={subCategories}
            onSearch={(value) => setSubCategorySearch(value)}
            placeholder="Select SubCategory"
          ></DropdownSelect>
        </div>
      </div>
    </>
  );
};

const TopicInfo = ({ control, getValues, setValue }) => {
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
        onSelect={handleAddTag}
      ></SearchWithDropdown>

      <div className="min-h-[50px] mt-4">
        <Controller
          name="topics"
          control={control}
          render={({ field }) =>
            field.value?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {field.value.map((topic, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between px-3 py-1 bg-blue-200 text-blue-800 rounded-full"
                  >
                    <span>{topic?.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(topic)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      &times;
                    </button>
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

const Thumbnail = ({ control, setValue }) => {
  const uploadFile = async (file: File) => {
    const payload: UploadFilePayload = {
      file: file,
      type: SystemFileType.COURSE_INFO,
    };
    const fileRes: NFile = await fileService.upload(payload);
    setValue("thumbnail", fileRes.url);
  };

  return (
    <div className="flex items-center mb-2">
      <FileUpload label={"Thumbnail"} upload={uploadFile}></FileUpload>
      <Controller
        name="thumbnail"
        control={control}
        render={({ field }) => (
          <CustomImage
            src={field.value || "/images/course.jpg"}
            alt="preview"
            className="w-[300px] h-[160px] rounded-lg ml-4 border-stroke border "
          />
        )}
      />
    </div>
  );
};
