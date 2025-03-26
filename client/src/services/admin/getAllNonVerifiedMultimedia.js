import axios from "axios";
import API_ROUTE_PATHS from "@utils/constants/ApiRoutes";

const getAllNonVerifiedMultimedia = async () => {
  const res = await axios.get(API_ROUTE_PATHS.getAllNonVerifiedMultimedia, {
    withCredentials: true,
  });
  return res.data;
};

export default getAllNonVerifiedMultimedia;
