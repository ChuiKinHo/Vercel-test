import axios from "axios";
import { resetPasswordSchema } from "@utils/validationSchema/globalSchema";
import API_ROUTE_PATHS from "@utils/constants/ApiRoutes";

const resetPassword = async ({ newPassword, newConfirmedPassword, token }) => {
  const dataValidation = await resetPasswordSchema.validate({
    newPassword,
    newConfirmedPassword,
  });
  if (!dataValidation) {
    return { status: 403, message: "Data Validation Fails" };
  }

  const res = await axios.post(API_ROUTE_PATHS.resetPassword, {
    newPassword,
    token,
  });
  return res.data;
};

export default resetPassword;
