import React, { useState } from "react";
import { useField, useFormikContext } from "formik";
import {
  EyeIcon,
  EyeSlashIcon,
  ExclamationCircleIcon,
  FlagIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import CustomDropdown from "../Dropdown/CustomDropdown";
import usePhoneMenu from "../Dropdown/DropdownMenu/PhoneMenu";
import { styles } from "./styles";

const CustomFormInputField = ({
  type = "text",
  name,
  id,
  placeholder,
  style,
  varient,
  disabled,
  autoComplete,
  onMenuItemSelected,
  rows = 2
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const formik = useFormikContext();
  const [field, meta] = name ? useField(name) : [null, null];

  const PhoneMenu = usePhoneMenu();

  const renderContent = {
    password: (
      <button
        onClick={() => setShowPassword(!showPassword)}
        className="p-2 focus:outline-none"
        type="button"
      >
        {showPassword ? (
          <EyeIcon className="size-5 text-black cursor-pointer" />
        ) : (
          <EyeSlashIcon className="size-5 text-black cursor-pointer" />
        )}
      </button>
    ),
    phone: (
      <CustomDropdown
        buttonStyle="phone-dropdown-btn"
        buttonIcon={
          <div
            className={`flex flex-row ${
              !!formik?.values?.tel_country_code ? "gap-x-2" : "gap-x-4"
            } `}
          >
            {!!formik?.values?.tel_country_code ? (
              <span className="text-center text-xs">{`(+${formik.values.tel_country_code})`}</span>
            ) : (
              <FlagIcon className="size-4 text-black" />
            )}
            <ChevronDownIcon className="size-4 text-black" />
          </div>
        }
        dropdownMenu={PhoneMenu}
        dropdownMenuVarient="pr-1.5 mt-1"
        dropdownMenuItemVarient="gap-x-2"
        dropdownMenuItemStyle="phone-dropdown-item"
        menuWidth="w-24"
        menuGap={0.5}
        onMenuItemSelected={onMenuItemSelected}
      />
    ),
  };

  return (
    <div className="relative">
      {name && id === "phone" && (
        <div className="absolute p-1">{renderContent["phone"]}</div>
      )}

      {type === "textarea" ? (
        <textarea
          id={id}
          placeholder={placeholder}
          rows={rows}
          className={`${styles[style]} ${varient} ${meta?.error && "pr-9"} w-full resize-none`}
          disabled={disabled}
          {...field}
        />
      ) : (
        <input
          type={showPassword ? "text" : type}
          id={id}
          placeholder={placeholder}
          className={`${styles[style]} ${varient} ${meta?.error && "pr-9"}`}
          disabled={disabled}
          autoComplete={autoComplete}
          {...field}
        />
      )}

      {name && (
        <div className="absolute inset-y-0 right-3 flex items-center">
          {type === "password" && renderContent["password"]}
          {meta?.error && meta?.touched && type !== "textarea" && (
            <ExclamationCircleIcon className="size-5 text-red-warning-heavy" />
          )}
        </div>
      )}
    </div>
  );
};

export default CustomFormInputField;