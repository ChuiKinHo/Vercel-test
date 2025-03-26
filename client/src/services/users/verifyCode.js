import axios from "axios";
import { codeVerificationSchema } from "@utils/validationSchema/globalSchema";
import API_ROUTE_PATHS from "@utils/constants/ApiRoutes";

const verifyCode = async ({ code }) => {
  const dataValidation = await codeVerificationSchema.validate({
    code,
  });
  if (!dataValidation) {
    return { status: 403, message: "Data Validation Fails" };
  }
  const res = await axios.post(API_ROUTE_PATHS.verifyCode, {
    code,
  },{
    withCredentials: true
  });
  return res.data;
};

export default verifyCode;
