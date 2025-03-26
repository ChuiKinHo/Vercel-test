import axios from "axios";
import API_ROUTE_PATHS from "@utils/constants/ApiRoutes";

const updateToiletRating = async ({ rating, toiletId }) => {
  const res = await axios.post(
    API_ROUTE_PATHS.updateToiletRating,
    {
      rating,
      toiletId,
    },
    { withCredentials: true }
  );
  return res.data;
};

export default updateToiletRating;
