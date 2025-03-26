import axios from "axios";
import API_ROUTE_PATHS from "@utils/constants/ApiRoutes";

const register = async () => {
  const res = await axios.post(
    API_ROUTE_PATHS.register,
    {},
    {
      withCredentials: true,
    }
  );
  return res.data;
};

export default register;
