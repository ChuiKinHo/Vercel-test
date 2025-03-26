import axios from "axios";
import API_ROUTE_PATHS from "@utils/constants/ApiRoutes";

const exchangeReward = async ({rewardId}) => {
  const res = await axios.post(
    API_ROUTE_PATHS.exchangeReward,
    { rewardId },
    {
      withCredentials: true,
    }
  );
  return res.data;
};

export default exchangeReward;
