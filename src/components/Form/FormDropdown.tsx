"use client";

import React from "react";
import {
  Control,
  Controller,
  Path,
  PathValue,
  RegisterOptions,
} from "react-hook-form";
import FormError from "./FormError";
import NDropdown from "../_commons/NDropdown";

interface FormDropdownProps<T, F> {
  control: Control<F>;
  name: Path<F>;
  defaultValue?: F;
  options: T[];
  bindLabel?: keyof T;
  bindValue?: keyof T;
  className?: string;
  renderLabel?: (option: T) => React.ReactNode;
  renderOption?: (option: T) => React.ReactNode;
  multiple?: boolean;
  placeholder?: string;
  searchable?: boolean;
  clearable?: boolean;
  rules?: Omit<
    RegisterOptions<F>,
    "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
  >;
  onSearch?: (key?: string) => void;
}

const FormDropdown = <T extends object, F extends object>({
  control,
  name,
  defaultValue,
  options,
  bindLabel = "name" as keyof T,
  bindValue,
  placeholder,
  className,
  multiple = false,
  rules,
  searchable = false,
  clearable = false,
  onSearch,
  renderLabel,
  renderOption,
}: FormDropdownProps<T, F>) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      defaultValue={defaultValue as PathValue<F, Path<F>>}
      render={({ field, fieldState }) => (
        <>
          <NDropdown
            value={field.value}
            bindLabel={bindLabel}
            bindValue={bindValue}
            placeholder={placeholder}
            searchable={searchable}
            multiple={multiple}
            className={className}
            clearable={clearable}
            options={options}
            onSearch={onSearch}
            renderLabel={renderLabel}
            renderOption={renderOption}
            onChange={(value) => field.onChange(value)}
          />

          {rules && <FormError error={fieldState.error} />}
        </>
      )}
    />
  );
};

export default FormDropdown;
