import axios from "axios";
import API_ROUTE_PATHS from "@utils/constants/ApiRoutes";

const getUserFriendsData = async () => {
  const res = await axios.get(API_ROUTE_PATHS.getUserFriendsData, {
    withCredentials: true,
  });
  return res.data;
};

export default getUserFriendsData;
