import { Multimedia } from "../../../models/index.js";
import nonVerifiedMultimediaFormatter from "../../../utils/helperFunctions/formatter/nonVerifiedMultimediaFormatter.js";
import {
  ErrorMessages,
  SuccessMessages,
} from "../../../utils/constants/Message.js";

const getAllNonVerifiedMultimedia = async (req, res) => {
  try {
    const non_verified_multimedia = await Multimedia.find({
      role: "non_verified",
      toiletId: { $ne: null },
    }).populate([
      { path: "userId", select: "_id email userAvatar fullname username" },
      {
        path: "toiletId",
        select:
          "_id name_en name_zh address_en address_zh district_en district_zh sub_district_en sub_district_zh area_en area_zh location type_of_toilet isMale isFemale isDisabled haveBathroom",
      },
    ]);

    return res.status(200).json({
      status: 200,
      data: nonVerifiedMultimediaFormatter(non_verified_multimedia),
      message: SuccessMessages.GET_ALL_NON_VERIFIED_MULTIMEDIA_SUCCESS,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
    });
  }
};

export default getAllNonVerifiedMultimedia;
