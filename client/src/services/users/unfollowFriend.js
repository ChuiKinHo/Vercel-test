import axios from "axios";
import API_ROUTE_PATHS from "@utils/constants/ApiRoutes";

const unfollowFriend = async ({ friendId }) => {
  const res = await axios.post(
    API_ROUTE_PATHS.unfollowFriend,
    { friendId },
    {
      withCredentials: true,
    }
  );
  return res.data;
};

export default unfollowFriend;
