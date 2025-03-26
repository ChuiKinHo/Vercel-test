import axios from "axios";
import { commentSchema } from "@utils/validationSchema/globalSchema";
import API_ROUTE_PATHS from "@utils/constants/ApiRoutes";

const addToiletComment = async ({ comment, toiletId }) => {
  const dataValidation = await commentSchema.validate({
    comment,
  });
  if (!dataValidation) {
    return { status: 403, message: "Data Validation Fails" };
  }
  const res = await axios.post(
    API_ROUTE_PATHS.addToiletComment,
    {
      toiletId,
      comment,
    },
    { withCredentials: true }
  );
  return res.data;
};

export default addToiletComment;
