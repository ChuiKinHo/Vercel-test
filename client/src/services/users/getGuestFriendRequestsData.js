import axios from "axios";
import API_ROUTE_PATHS from "@utils/constants/ApiRoutes";

const getGuestFriendRequestsData = async ({ guestId }) => {
  const res = await axios.post(
    API_ROUTE_PATHS.getUserFriendRequestsData,
    { guestId },
    {
      withCredentials: true,
    }
  );
  return res.data;
};

export default getGuestFriendRequestsData;
