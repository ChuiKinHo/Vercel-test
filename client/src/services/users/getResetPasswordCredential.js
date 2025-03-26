import axios from "axios";
import API_ROUTE_PATHS from "@utils/constants/ApiRoutes";

const getResetPasswordCredential = async ({ token }) => {
  const res = await axios.get(API_ROUTE_PATHS.getResetPasswordCredential, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export default getResetPasswordCredential;
