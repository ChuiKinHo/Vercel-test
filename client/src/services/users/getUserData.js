import axios from "axios";
import API_ROUTE_PATHS from "@utils/constants/ApiRoutes";

const getUserData = async () => {
  const res = await axios.get(API_ROUTE_PATHS.getUserData, {
    withCredentials: true,
  });
  return res.data;
};

export default getUserData;
