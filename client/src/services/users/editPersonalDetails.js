import axios from "axios";
import { personalDetailsSchema } from "@utils/validationSchema/globalSchema";
import API_ROUTE_PATHS from "@utils/constants/ApiRoutes";

const editPersonalDetails = async ({
  fullname,
  username,
  phone,
  location,
  tel_country_code,
}) => {
  const dataValidation = await personalDetailsSchema.validate({
    fullname,
    username,
    phone,
    location,
    tel_country_code,
  });
  if (!dataValidation) {
    return { status: 403, message: "Data Validation Fails" };
  }
  const res = await axios.post(
    API_ROUTE_PATHS.editPersonalDetails,
    {
      fullname,
      username,
      phone,
      location,
      tel_country_code,
    },
    { withCredentials: true }
  );
  return res.data;
};

export default editPersonalDetails;
