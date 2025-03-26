import axios from "axios";
import API_ROUTE_PATHS from "@utils/constants/ApiRoutes";

const deleteNonVerifiedToilet = async ({ toiletId }) => {
  const res = await axios.post(
    API_ROUTE_PATHS.deleteNonVerifiedToilet,
    { toiletId },
    { withCredentials: true }
  );
  return res.data;
};

export default deleteNonVerifiedToilet;
