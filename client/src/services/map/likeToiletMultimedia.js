import axios from "axios";
import API_ROUTE_PATHS from "@utils/constants/ApiRoutes";

const likeToiletMultimedia = async ({ multimediaId, toiletId }) => {
  const res = await axios.post(
    API_ROUTE_PATHS.likeToiletMultimedia,
    {
      multimediaId,
      toiletId,
    },
    { withCredentials: true }
  );
  return res.data;
};

export default likeToiletMultimedia;
