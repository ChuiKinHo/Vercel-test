import axios from "axios";
import { markerCustomizationSchema } from "@utils/validationSchema/globalSchema";
import API_ROUTE_PATHS from "@utils/constants/ApiRoutes";

const changePreferenceMarker = async ({ preference_marker }) => {
  const dataValidation = await markerCustomizationSchema.validate({
    preference_marker,
  });
  if (!dataValidation) {
    return { status: 403, message: "Data Validation Fails" };
  }

  const res = await axios.post(
    API_ROUTE_PATHS.changePreferenceMarker,
    {
      preference_marker,
    },
    { withCredentials: true }
  );
  return res.data;
};

export default changePreferenceMarker;
