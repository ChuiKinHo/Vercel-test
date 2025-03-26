import axios from "axios";
import API_ROUTE_PATHS from "@utils/constants/ApiRoutes";

const acceptFriendRequest = async ({ guestId }) => {
  const res = await axios.post(
    API_ROUTE_PATHS.acceptFriendRequest,
    { guestId },
    {
      withCredentials: true,
    }
  );
  return res.data;
};

export default acceptFriendRequest;
