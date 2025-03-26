import React, { forwardRef } from "react";
import { styles } from "./styles";

const CustomInputField = forwardRef(({
  type = "text",
  id,
  placeholder,
  style = "default",
  varient,
  accept,
  onChange,
  onKeyDown,
  disabled,
  value,
}, ref) => {
  const renderContent = {
    file: (
      <label
        htmlFor="file-upload"
        className={styles["file-upload-inputfield"]}
      ></label>
    ),
  };

  return (
    <div className="relative">
      <input
        ref={ref}
        type={type}
        id={type === "file" ? "file-upload" : id}
        placeholder={placeholder}
        className={`${styles[style]} ${varient}`}
        accept={accept}
        onChange={onChange}
        onKeyDown={onKeyDown}
        disabled={disabled}
        value={value}
      />
      {type === "file" && renderContent["file"]}
    </div>
  );
});

export default CustomInputField;
