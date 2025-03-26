import React, { forwardRef } from "react";
import { useField } from "formik";
import { styles } from "./styles";

const CustomVerificationInputField = forwardRef(
  ({ id, name, onChange, onKeyDown }, ref) => {
    const [field] = useField(name);
    return (
      <input
        {...field}
        type="text"
        id={id}
        className={`${styles["verification-code-inputfield"]}`}
        ref={ref}
        maxLength="1"
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder="•"
      />
    );
  }
);

export default CustomVerificationInputField;
