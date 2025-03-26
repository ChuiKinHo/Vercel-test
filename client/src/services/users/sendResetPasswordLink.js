import axios from "axios";
import { emailSchema } from "@utils/validationSchema/globalSchema";
import API_ROUTE_PATHS from "@utils/constants/ApiRoutes";

const sendResetPasswordLink = async ({ email }) => {
  const dataValidation = await emailSchema.validate({
    email,
  });
  if (!dataValidation) {
    return { status: 403, message: "Data Validation Fails" };
  }
  const res = await axios.post(API_ROUTE_PATHS.sendResetPasswordLink, {
    email,
  });
  return res.data;
};

export default sendResetPasswordLink;
