import axios from "axios";
import API_ROUTE_PATHS from "@utils/constants/ApiRoutes";

const approveNonVerifiedMultimedia = async (data) => {
    console.log(data);
    
  const res = await axios.post(
    API_ROUTE_PATHS.approveNonVerifiedMultimedia,
    {
      toiletId: data.toiletId,
      userId: data.userId,
      toilet_images: data.toilet_images,
      toilet_videos: data.toilet_videos,
      deletedMultimedia: data.deletedMultimedia,
    },
    { withCredentials: true }
  );
  return res.data;
};

export default approveNonVerifiedMultimedia;
