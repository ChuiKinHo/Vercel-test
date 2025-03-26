import axios from "axios";
import API_ROUTE_PATHS from "@utils/constants/ApiRoutes";

const logout = async () => {
  const res = await axios.get(API_ROUTE_PATHS.logout, {
    withCredentials: true,
  });
  return res.data;
};

export default logout;
