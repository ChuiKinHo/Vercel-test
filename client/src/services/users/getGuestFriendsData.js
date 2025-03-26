import axios from "axios";
import API_ROUTE_PATHS from "@utils/constants/ApiRoutes";

const getGuestFriendsData = async ({ guestId }) => {
  const res = await axios.post(
    API_ROUTE_PATHS.getUserFriendsData,
    { guestId },
    {
      withCredentials: true,
    }
  );
  return res.data;
};

export default getGuestFriendsData;
