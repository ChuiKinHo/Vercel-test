import axios from "axios";
import API_ROUTE_PATHS from "@utils/constants/ApiRoutes";

const loginAsGuest = async () => {
  const res = await axios.get(API_ROUTE_PATHS.loginAsGuest,{ withCredentials: true });
  return res.data;
};

export default loginAsGuest;
