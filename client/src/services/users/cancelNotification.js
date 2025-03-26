import axios from "axios";
import API_ROUTE_PATHS from "@utils/constants/ApiRoutes";

const cancelNotification = async ({ userId, role }) => {
  const res = await axios.post(
    API_ROUTE_PATHS.cancelNotification,
    { userId, role },
    {
      withCredentials: true,
    }
  );
  return res.data;
};

export default cancelNotification;
