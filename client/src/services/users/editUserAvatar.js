import axios from "axios";
import API_ROUTE_PATHS from "@utils/constants/ApiRoutes";

const editUserAvatar = async ({ upload, fileMimeType }) => {
  const res = await axios.post(
    API_ROUTE_PATHS.editUserAvatar,
    { upload, fileMimeType },
    {
      withCredentials: true,
    }
  );
  return res.data;
};

export default editUserAvatar;
