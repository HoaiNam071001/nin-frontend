import React from "react";
import {
  Controller,
  Control,
  FieldValues,
  PathValue,
  Path,
  RegisterOptions,
} from "react-hook-form";
import NInput from "./NInput"; // Giả sử bạn có component NInput
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
};

const FormInput = <TFieldValues extends FieldValues>({
  name,
  control,
  defaultValue,
  placeholder = "",
  rules,
  id,
  addonBefore,
  addonAfter
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
            onValueChange={field.onChange}
            placeholder={placeholder}
            addonBefore={addonBefore}
            addonAfter={addonAfter}
          />
          {rules && <FormError error={fieldState.error} />}
        </>
      )}
    />
  );
};

export default FormInput;
