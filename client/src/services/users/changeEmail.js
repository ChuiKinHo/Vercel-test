import axios from "axios";
import API_ROUTE_PATHS from "@utils/constants/ApiRoutes";

const changeEmail = async ({ token }) => {
  const res = await axios.post(
    API_ROUTE_PATHS.changeEmail,
    {
      token,
    },
    { withCredentials: true }
  );
  return res.data;
};

export default changeEmail;
