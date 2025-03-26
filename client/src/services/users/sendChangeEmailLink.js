import axios from "axios";
import { changeEmailSchema } from "@utils/validationSchema/globalSchema";
import API_ROUTE_PATHS from "@utils/constants/ApiRoutes";

const sendChangeEmailLink = async ({ originalEmail, newEmail }) => {
  const dataValidation = await changeEmailSchema.validate({
    originalEmail,
    newEmail,
  });
  if (!dataValidation) {
    return { status: 403, message: "Data Validation Fails" };
  }
  const res = await axios.post(
    API_ROUTE_PATHS.sendChangeEmailLink,
    {
      newEmail,
    },
    { withCredentials: true }
  );
  return res.data;
};

export default sendChangeEmailLink;
