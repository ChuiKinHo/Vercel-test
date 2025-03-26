import axios from "axios";
import API_ROUTE_PATHS from "@utils/constants/ApiRoutes";

const getUserFriendRequestsData = async () => {
  const res = await axios.get(API_ROUTE_PATHS.getUserFriendRequestsData, {
    withCredentials: true,
  });
  return res.data;
};

export default getUserFriendRequestsData;
