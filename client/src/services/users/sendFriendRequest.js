import axios from "axios";
import API_ROUTE_PATHS from "@utils/constants/ApiRoutes";

const sendFriendRequest = async ({ guestId }) => {
  const res = await axios.post(
    API_ROUTE_PATHS.sendFriendRequest,
    {
      guestId,
    },
    { withCredentials: true }
  );
  return res.data;
};

export default sendFriendRequest;
