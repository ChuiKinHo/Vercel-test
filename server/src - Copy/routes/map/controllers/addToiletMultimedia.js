import { Multimedia } from "../../../models/index.js";
import {
  ErrorMessages,
  SuccessMessages,
} from "../../../utils/constants/Message.js";

const addToiletMultimedia = async (req, res) => {
  try {
    const { userId } = req.cookieValue;
    const { toiletId, toilet_images, toilet_videos } = req.body;

    // Save Images
    let multimediaIds = [];
    for (const image of toilet_images) {
      const newImage = new Multimedia({
        role: "non_verified",
        multimedia_type: "image",
        userId: userId,
        toiletId: toiletId,
        url: image.file_base64,
      });
      await newImage.save();
      multimediaIds.push(newImage._id);
    }

    // Save Videos
    for (const video of toilet_videos) {
      const newVideo = new Multimedia({
        role: "non_verified",
        multimedia_type: "video",
        userId: userId,
        toiletId: toiletId,
        url: video.file_base64,
      });
      await newVideo.save();
      multimediaIds.push(newVideo._id);
    }

    return res.status(200).json({
      status: 200,
      message: SuccessMessages.ADD_TOILET_SUCCESS,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
    });
  }
};

export default addToiletMultimedia;
