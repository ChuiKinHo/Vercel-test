import * as Yup from "yup";
import {
  emailRule,
  passwordRule,
  codeVerificationRule,
  fullnameRule,
  usernameRule,
  phoneRule,
  locationRule,
} from "./schemaRules.js";

const userLoginSchema = Yup.object({
  email: emailRule,
  password: passwordRule,
});

const codeVerificationSchema = Yup.object({ code: codeVerificationRule });

const personalDetailsSchema = Yup.object({
  fullname: fullnameRule,
  username: usernameRule,
  phone: phoneRule,
  location: locationRule,
});

export { userLoginSchema, codeVerificationSchema, personalDetailsSchema };
