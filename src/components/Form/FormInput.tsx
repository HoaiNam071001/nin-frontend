"use client"
import React from "react";
import {
  Controller,
  Control,
  FieldValues,
  PathValue,
  Path,
  RegisterOptions,
} from "react-hook-form";
import NInput from "../_commons/NInput"; // Giả sử bạn có component NInput
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
  type?: "text" | "password" | "email" | "number" | "tel"; // Common input types
  onSearch?: (value: string) => void;
};

const FormInput = <TFieldValues extends object>({
  name,
  control,
  defaultValue,
  placeholder = "",
  rules,
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
            {...rest}
          />
          {rules && <FormError error={fieldState.error} />}
        </>
      )}
    />
  );
};

export default FormInput;
