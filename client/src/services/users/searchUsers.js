import axios from "axios";
import API_ROUTE_PATHS from "@utils/constants/ApiRoutes";

const searchUsers = async ({ query: username }) => {
  const res = await axios.post(
    API_ROUTE_PATHS.searchUsers,
    {
      username,
    },
    { withCredentials: true }
  );
  return res.data;
};

export default searchUsers;
