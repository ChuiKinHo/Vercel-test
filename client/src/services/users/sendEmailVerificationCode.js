import axios from "axios";
import { userRegisterSchema } from "@utils/validationSchema/globalSchema";
import API_ROUTE_PATHS from "@utils/constants/ApiRoutes";

const sendEmailVerificationCode = async ({
  email,
  password,
  confirmedPassword,
}) => {
  const dataValidation = await userRegisterSchema.validate({
    email,
    password,
    confirmedPassword,
  });
  if (!dataValidation) {
    return { status: 403, message: "Data Validation Fails" };
  }
  const res = await axios.post(
    API_ROUTE_PATHS.sendEmailVerificationCode,
    {
      email,
      password,
    },
    { withCredentials: true }
  );
  return res.data;
};

export default sendEmailVerificationCode;
