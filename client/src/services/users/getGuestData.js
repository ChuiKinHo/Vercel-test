import axios from "axios";
import API_ROUTE_PATHS from "@utils/constants/ApiRoutes";

const getGuestData = async ({ guestId }) => {
  const res = await axios.post(
    API_ROUTE_PATHS.getUserData,
    { guestId },
    {
      withCredentials: true,
    }
  );
  return res.data;
};

export default getGuestData;
