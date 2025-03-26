import axios from "axios";
import { addToiletMultimediaSchema } from "@utils/validationSchema/globalSchema";
import API_ROUTE_PATHS from "@utils/constants/ApiRoutes";

const addToiletMultimedia = async ({
  toiletId,
  toilet_images,
  toilet_videos,
}) => {
  const dataValidation = await addToiletMultimediaSchema.validate({
    toilet_images,
    toilet_videos,
  });
  if (!dataValidation) {
    return { status: 403, message: "Data Validation Fails" };
  }

  const res = await axios.post(
    API_ROUTE_PATHS.addToiletMultimedia,
    {
      toiletId,
      toilet_images,
      toilet_videos,
    },
    { withCredentials: true }
  );
  return res.data;
};

export default addToiletMultimedia;
