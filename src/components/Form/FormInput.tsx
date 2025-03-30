"use client";
import React from "react";
import {
  Control,
  Controller,
  FieldValues,
  Path,
  PathValue,
  RegisterOptions,
} from "react-hook-form";
import NInput, { InputType } from "../_commons/NInput"; // Giả sử bạn có component NInput
import FormError from "./FormError"; // Giả sử bạn có component FormError

type ControlledInputProps<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  defaultValue?: PathValue<TFieldValues, Path<TFieldValues>>;
  placeholder?: string;
  rules?: Omit<
    RegisterOptions<TFieldValues, Path<TFieldValues>>,
    "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
  >;
  id?: string;
  addonBefore?: React.ReactNode; // Addon content before the input
  addonAfter?: React.ReactNode;
  type?: InputType; // Common input types
  onSearch?: (value: string) => void;
  disabled?: boolean;
};

const FormInput = <TFieldValues extends object>({
  name,
  control,
  defaultValue,
  placeholder = "",
  rules,
  disabled,
  id,
  type = "text",
  addonBefore,
  addonAfter,
  onSearch,
  ...rest
}: ControlledInputProps<TFieldValues>) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      disabled={disabled}
      render={({ field, fieldState }) => (
        <>
          <NInput
            id={id || name}
            value={field.value}
            type={type}
            onBlur={field.onBlur}
            onValueChange={field.onChange}
            placeholder={placeholder}
            addonBefore={addonBefore}
            addonAfter={addonAfter}
            onSearch={onSearch}
            disabled={disabled}
            {...rest}
          />
          {rules && <FormError error={fieldState.error} />}
        </>
      )}
    />
  );
};

export default FormInput;
