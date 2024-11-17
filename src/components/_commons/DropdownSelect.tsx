import React, { useState } from "react";
import { Control, Controller } from "react-hook-form";
import ClickOutside from "./ClickOutside";
import FormInput from "./NInput";

interface DropdownSelectProps {
  control: Control;
  name: string;
  options: object[];
  bindLabel?: string;
  bindValue?: string;
  placeholder?: string;
  searchable?: boolean;
  variant?:
    | "primary"
    | "secondary-black"
    | "secondary-gray"
    | "secondary-primary"; // Button color variant
}

const DropdownSelect: React.FC<DropdownSelectProps> = ({
  control,
  name,
  options,
  bindLabel = "name",
  bindValue = "id",
  placeholder,
  variant = "secondary", // Default variant is "primary"
  searchable = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState<number | string>("");

  const toggleDropdown = () => setIsOpen((prev) => !prev);

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
    <div className="relative inline-block text-left min-w-[100px] w-full">
      <Controller
        control={control}
        name={name}
        defaultValue=""
        render={({ field }) => (
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
                  field.value[bindLabel]
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
                <div className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 w-full mt-2">
                  <ul className="py-2 text-sm text-gray-700 dark:text-gray-200 max-h-[200px] overflow-auto">
                    {searchable && (
                      <div className="mx-2 mb-2">
                        <FormInput
                          value={searchText}
                          onValueChange={(e) => setSearchText(e)}
                          placeholder="search"
                          keyDown={handleKeyDown}
                        />
                      </div>
                    )}

                    {options.map((option) => (
                      <li key={option[bindValue]}>
                        <button
                          type="button"
                          onClick={() => {
                            field.onChange(option); // Update form field with selected value
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
          </>
        )}
      />
    </div>
  );
};

export default DropdownSelect;
