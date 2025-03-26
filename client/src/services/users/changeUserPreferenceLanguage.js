import axios from "axios";
import API_ROUTE_PATHS from "@utils/constants/ApiRoutes";

const changeUserPreferenceLanguage = async ({ preference_language }) => {
  const res = await axios.post(
    API_ROUTE_PATHS.changeUserPreferenceLanguage,
    { preference_language },
    {
      withCredentials: true,
    }
  );
  return res.data;
};

export default changeUserPreferenceLanguage;
