import axios from "axios";
import API_ROUTE_PATHS from "@utils/constants/ApiRoutes";

const getAllNonVerifiedToiletsData = async () => {
  const res = await axios.get(
    API_ROUTE_PATHS.getAllNonVerifiedToiletsData,
    { withCredentials: true }
  );
  return res.data;
};

export default getAllNonVerifiedToiletsData;
