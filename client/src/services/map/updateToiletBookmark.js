import axios from "axios";
import API_ROUTE_PATHS from "@utils/constants/ApiRoutes";

const updateToiletBookmark = async ({ userId, toiletId }) => {
  const res = await axios.post(
    API_ROUTE_PATHS.updateToiletBookmark,
    {
      userId,
      toiletId,
    },
    { withCredentials: true }
  );
  return res.data;
};

export default updateToiletBookmark;
