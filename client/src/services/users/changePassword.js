import axios from "axios";
import { changePasswordSchema } from "@utils/validationSchema/globalSchema";
import API_ROUTE_PATHS from "@utils/constants/ApiRoutes";

const changePassword = async ({
  originalPassword,
  newPassword,
  newConfirmedPassword,
}) => {
  const dataValidation = await changePasswordSchema.validate({
    originalPassword,
    newPassword,
    newConfirmedPassword,
  });
  if (!dataValidation) {
    return { status: 403, message: "Data Validation Fails" };
  }
  const res = await axios.post(
    API_ROUTE_PATHS.changePassword,
    {
      originalPassword,
      newPassword,
    },
    { withCredentials: true }
  );
  return res.data;
};

export default changePassword;
