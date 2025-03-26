import axios from "axios";
import API_ROUTE_PATHS from "@utils/constants/ApiRoutes";

const getToiletsLocationNearby = async ({
  latitude,
  longitude,
  nearbyCircleRadius,
}) => {
  const res = await axios.post(API_ROUTE_PATHS.getToiletsLocationNearby, {
    latitude,
    longitude,
    nearbyCircleRadius,
  });
  return res.data;
};

export default getToiletsLocationNearby;
