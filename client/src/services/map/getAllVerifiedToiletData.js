import axios from "axios";
import API_ROUTE_PATHS from "@utils/constants/ApiRoutes";

const getAllVerifiedToiletData = async () => {
  const res = await axios.get(
    API_ROUTE_PATHS.getAllVerifiedToiletData,
    { withCredentials: true }
  );
  return res.data;
};

export default getAllVerifiedToiletData;
