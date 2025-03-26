import axios from "axios";
import API_ROUTE_PATHS from "@utils/constants/ApiRoutes";

const getRegistrationCredential = async () => {
  const res = await axios.get(API_ROUTE_PATHS.getRegistrationCredential, {
    withCredentials: true,
  });
  return res.data;
};

export default getRegistrationCredential;
