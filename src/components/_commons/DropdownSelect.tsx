import React, { useEffect, useState } from "react";
import {
  Control,
  Controller,
  FieldValues,
  Path,
  PathValue,
  RegisterOptions,
} from "react-hook-form";
import ClickOutside from "./ClickOutside";
import FormInput from "./NInput";
import useDebounce from "@/hooks/useDebounce";
import FormError from "./FormError";

interface DropdownSelectProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  defaultValue?: PathValue<TFieldValues, Path<TFieldValues>>;
  options: object[];
  bindLabel?: string;
  bindValue?: string;
  className?: string;
  placeholder?: string;
  searchable?: boolean;
  rules?: Omit<
    RegisterOptions<TFieldValues, Path<TFieldValues>>,
    "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
  >;
  variant?:
    | "primary"
    | "secondary"
    | "secondary-black"
    | "secondary-gray"
    | "secondary-primary"; // Button color variant
  onSearch?: (key?: string) => void;
}

const DropdownSelect = <TFieldValues extends FieldValues>({
  control,
  name,
  defaultValue,
  options,
  bindLabel = "name",
  bindValue,
  placeholder,
  className,
  rules,
  variant = "secondary", // Default variant is "primary"
  searchable = false,
  onSearch,
}: DropdownSelectProps<TFieldValues>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState<string>("");
  const searchTextDebounce = useDebounce<string>(searchText, 500); // Debounce với delay 500ms

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    onSearch?.(searchTextDebounce);
  }, [onSearch, searchTextDebounce]);

  const variantClasses = {
    primary: "bg-blue-500 text-white hover:bg-blue-600", // Primary button
    secondary: "bg-white border border-stroke text-black hover:bg-gray-100", // Secondary button with black text
    "secondary-primary":
      "bg-white border border-blue-500 text-blue-500 hover:bg-blue-100", // Secondary button with primary text
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  return (
    <div className={`${className || ''} relative inline-block text-left min-w-[100px] w-full`}>
      <Controller
        control={control}
        name={name}
        rules={rules}
        defaultValue={defaultValue}
        render={({ field, fieldState }) => (
          <>
            <ClickOutside onClick={() => setIsOpen(false)} className="relative">
              <button
                type="button"
                onClick={toggleDropdown}
                className={`${variantClasses[variant]} w-full min-w-[100px] p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-between rounded-md`}

                // className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                {/* Display selected option label */}
                {field.value ? (
                  bindValue ? options?.find(e=> e?.[bindValue] === field.value)?.[bindLabel] : field.value?.[bindLabel]
                ) : (
                  <span className="text-gray-400">
                    {placeholder || "Select an option"}
                  </span>
                )}
                <svg
                  className="w-2.5 h-2.5 ms-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>

              {isOpen && (
                <div className="border border-stroke py-2 absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 w-full mt-2">
                  <ul className="text-sm text-gray-700 dark:text-gray-200 max-h-[200px] overflow-auto relative">
                    {searchable && (
                      <div className="px-2 pb-2 sticky top-0 bg-white">
                        <FormInput
                          value={searchText}
                          onValueChange={(value) =>
                            setSearchText(value as string)
                          }
                          placeholder="search"
                          keyDown={handleKeyDown}
                        />
                      </div>
                    )}

                    {options.map((option, index) => (
                      <li key={index}>
                        <button
                          type="button"
                          onClick={() => {
                            field.onChange(bindValue? option?.[bindValue] : option); // Update form field with selected value
                            setIsOpen(false); // Close dropdown
                          }}
                          className="block px-4 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                          {option[bindLabel]}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </ClickOutside>
            {rules && <FormError error={fieldState.error} />}
          </>
        )}
      />
    </div>
  );
};

export default DropdownSelect;
