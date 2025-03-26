import axios from "axios";
import API_ROUTE_PATHS from "@utils/constants/ApiRoutes";

const getUserNotifications = async () => {
  const res = await axios.get(API_ROUTE_PATHS.getUserNotifications, {
    withCredentials: true,
  });
  return res.data;
};

export default getUserNotifications;
