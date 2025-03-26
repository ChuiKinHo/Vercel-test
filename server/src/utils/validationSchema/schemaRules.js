import * as Yup from "yup";

const emailRule = Yup.string()
  .required("Email is required")
  .email("Invalid Email Format");

const passwordRule = Yup.string()
  .required("Password is required")
  .min(8, "Password must be at least 8 characters long");

const codeVerificationRule = Yup.array()
  .of(
    Yup.string()
      .required("Field is required")
      .matches(/^\d$/, "Must be a integer")
  )
  .length(6, "Verification code must be exactly 6 digits");

const fullnameRule = Yup.string().required().max(23).trim();

const usernameRule = Yup.string().required().max(23).trim();

const phoneRule = Yup.string()
  .test("is_valid_format", "Phone number must contain only digits", (value) => {
    if (!value) return true;

    const isValidFormat = /^\d+$/.test(value);
    return isValidFormat;
  })
  .test("is_valid_min_required", "Invalid phone number", (value) => {
    if (!value) return true;

    const isValidLength = value.length >= 7 && value.length <= 13;
    return isValidLength;
  })
  .trim();

const locationRule = Yup.string();

export {
  emailRule,
  passwordRule,
  codeVerificationRule,
  fullnameRule,
  usernameRule,
  phoneRule,
  locationRule,
};
