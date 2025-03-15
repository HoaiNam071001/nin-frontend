"use client";
import React from "react";
import {
  Controller,
  Control,
  FieldValues,
  PathValue,
  Path,
  RegisterOptions,
} from "react-hook-form";
import FormError from "./FormError";
import TimeInput from "../_commons/TimeInput";

type ControlledTimeInputProps<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  defaultValue?: PathValue<TFieldValues, Path<TFieldValues>>;
  rules?: Omit<
    RegisterOptions<TFieldValues, Path<TFieldValues>>,
    "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
  >;
  id?: string;
};

const FormTimeInput = <TFieldValues extends object>({
  name,
  control,
  defaultValue,
  rules,
  id,
}: ControlledTimeInputProps<TFieldValues>) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      render={({ field, fieldState }) => (
        <>
          <TimeInput
            defaultSeconds={field.value as number}
            onChange={(seconds) => field.onChange(seconds)}
          />
          {rules && <FormError error={fieldState.error} />}
        </>
      )}
    />
  );
};

export default FormTimeInput;