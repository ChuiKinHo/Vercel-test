import axios from "axios";
import API_ROUTE_PATHS from "@utils/constants/ApiRoutes";

const updateToiletViews = async ({ toiletId, update }) => {
  const res = await axios.post(
    API_ROUTE_PATHS.updateToiletViews,
    {
      toiletId,
      update,
    },
    { withCredentials: true }
  );
  return res.data;
};

export default updateToiletViews;
