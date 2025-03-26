import axios from "axios";
import API_ROUTE_PATHS from "@utils/constants/ApiRoutes";

const changeUserPreferenceTheme = async ({ preference_theme }) => {
  const res = await axios.post(
    API_ROUTE_PATHS.changeUserPreferenceTheme,
    { preference_theme },
    {
      withCredentials: true,
    }
  );
  return res.data;
};

export default changeUserPreferenceTheme;
