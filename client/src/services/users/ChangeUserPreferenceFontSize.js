import axios from "axios";
import API_ROUTE_PATHS from "@utils/constants/ApiRoutes";

const changeUserPreferenceFontSize = async ({ preference_font_size }) => {
  const res = await axios.post(
    API_ROUTE_PATHS.changeUserPreferenceFontSize,
    { preference_font_size },
    {
      withCredentials: true,
    }
  );
  return res.data;
};

export default changeUserPreferenceFontSize;
