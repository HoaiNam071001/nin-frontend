"use client";

import FormDropdown from "@/components/Form/FormDropdown";
import FormInput from "@/components/Form/FormInput";
import NButton from "@/components/_commons/NButton";
import StatusBadge from "@/components/CourseItem/StatusBadge";
import SvgIcon from "@/components/_commons/SvgIcon";
import { CourseStatus } from "@/constants";
import { COURSE_STATUS_OPTIONS } from "@/constants/consts/course";
import { CourseSearchPayload } from "@/models";
import { DropdownOption } from "@/models/utils.model";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import I18n from "@/components/_commons/I18n";

const CensorFilter = ({ onSearchText, changeFilter }) => {
  const { control, watch, getValues } = useForm({
    defaultValues: {
      keyword: "",
      status: [CourseStatus.PENDING],
    },
  });
  const status = watch("status");
  useEffect(() => {
    const filter: CourseSearchPayload = {
      status: getValues("status"),
    };
    changeFilter?.(filter);
  }, [status]);

  const render = (item: DropdownOption<CourseStatus>) => {
    return <StatusBadge status={item.value} />;
  };

  const onSearch = () => {
    onSearchText?.(getValues("keyword"));
  };

  return (
    <div className="flex flex-col rounded-sm gap-3">
      <div>
        <FormInput
          name={`keyword`}
          control={control}
          placeholder="Search..."
          onSearch={onSearch}
          addonAfter={
            <NButton
              variant="link"
              color="secondary"
              size="lg"
              onClick={onSearch}
            >
              <SvgIcon icon="search" className="icon icon-sm" />
            </NButton>
          }
        />
      </div>
      <div className="w-[600px] form-group">
        <label><I18n i18key={"Status"}/> </label>
        <FormDropdown
          control={control}
          name={"status"}
          bindValue={"value"}
          renderLabel={render}
          renderOption={render}
          multiple={true}
          className="w-full"
          clearable={true}
          options={COURSE_STATUS_OPTIONS}
          placeholder="Select Status"
        ></FormDropdown>
      </div>
    </div>
  );
};

export default CensorFilter;
