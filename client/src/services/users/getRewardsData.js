import axios from "axios";
import API_ROUTE_PATHS from "@utils/constants/ApiRoutes";

const getRewardsData = async () => {
  const res = await axios.get(API_ROUTE_PATHS.getRewardsData, {
    withCredentials: true,
  });
  return res.data;
};

export default getRewardsData;
