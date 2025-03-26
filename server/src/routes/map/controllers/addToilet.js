import { Toilet, Rating, Multimedia } from "../../../models/index.js";
import {
  ErrorMessages,
  SuccessMessages,
} from "../../../utils/constants/Message.js";

const addToilet = async (req, res) => {
  try {
    const { userId } = req.cookieValue;
    const {
      address,
      area,
      district,
      sub_district,
      type_of_toilet,
      isMale,
      isFemale,
      isDisabled,
      haveBathroom,
      rating,
      toilet_images,
      toilet_videos,
      latitude,
      longitude,
      language,
    } = req.body;

    const newRating = new Rating({
      userId: userId,
      value: rating,
    });
    await newRating.save();

    // Save Images
    let multimediaImageIds = [];
    for (const image of toilet_images) {
      const newImage = new Multimedia({
        role: "non_verified",
        multimedia_type: "image",
        userId: userId,
        url: image.file_base64,
      });
      await newImage.save();
      multimediaImageIds.push(newImage._id);
    }

    // Save Videos
    let multimediaVideoIds = [];
    for (const video of toilet_videos) {
      const newVideo = new Multimedia({
        role: "non_verified",
        multimedia_type: "video",
        userId: userId,
        url: video.file_base64,
      });
      await newVideo.save();
      multimediaVideoIds.push(newVideo._id);
    }

    const newNonVerifiedToilet = new Toilet({
      role: "non_verified",
      userId: userId,
      name_zh: "",
      name_en: "",
      address_en: language === "en_us" ? address : "",
      address_zh: language === "zh_tw" ? address : "",
      sub_district_en: language === "en_us" ? sub_district : "",
      sub_district_zh: language === "zh_tw" ? sub_district : "",
      district_en: language === "en_us" ? district : "",
      district_zh: language === "zh_tw" ? address : "",
      area_en: language === "en_us" ? area : "",
      area_zh: language === "zh_tw" ? area : "",
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
      isMale: isMale,
      isFemale: isFemale,
      isDisabled: isDisabled,
      haveBathroom: haveBathroom,
      type_of_toilet: type_of_toilet,
      rating: [newRating._id],
      multimedia: [...multimediaImageIds, ...multimediaVideoIds],
    });
    await newNonVerifiedToilet.save();

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

export default addToilet;
