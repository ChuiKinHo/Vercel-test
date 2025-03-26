import axios from "axios";
import API_ROUTE_PATHS from "@utils/constants/ApiRoutes";

const resendEmailVerificationCode = async () => {
  const res = await axios.post(
    API_ROUTE_PATHS.resendEmailVerificationCode,
    {},
    { withCredentials: true }
  );
  return res.data;
};

export default resendEmailVerificationCode;
