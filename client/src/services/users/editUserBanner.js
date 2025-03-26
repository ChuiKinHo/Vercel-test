import axios from "axios";
import API_ROUTE_PATHS from "@utils/constants/ApiRoutes";

const editUserBanner = async ({ upload, fileMimeType }) => {
  const res = await axios.post(
    API_ROUTE_PATHS.editUserBanner,
    { upload, fileMimeType },
    {
      withCredentials: true,
    }
  );
  return res.data;
};

export default editUserBanner;
