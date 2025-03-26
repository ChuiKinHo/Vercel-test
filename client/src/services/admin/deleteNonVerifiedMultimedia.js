import axios from "axios";
import API_ROUTE_PATHS from "@utils/constants/ApiRoutes";

const deleteNonVerifiedMultimedia = async ({ multimediaIds }) => {
  const res = await axios.post(
    API_ROUTE_PATHS.deleteNonVerifiedMultimedia,
    { multimediaIds },
    { withCredentials: true }
  );
  return res.data;
};

export default deleteNonVerifiedMultimedia;
