import axios from "axios";
import API_ROUTE_PATHS from "@utils/constants/ApiRoutes";

const changeUserPreferenceColorblind = async ({ preference_colorblind }) => {
  const res = await axios.post(
    API_ROUTE_PATHS.changeUserPreferenceColorblind,
    { preference_colorblind },
    {
      withCredentials: true,
    }
  );
  return res.data;
};

export default changeUserPreferenceColorblind;
