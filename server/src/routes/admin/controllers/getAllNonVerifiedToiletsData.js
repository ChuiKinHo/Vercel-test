import { Toilet } from "../../../models/index.js";
import toiletDataFormatter from "../../../utils/helperFunctions/formatter/toiletDataFormatter.js";
import {
  ErrorMessages,
  SuccessMessages,
} from "../../../utils/constants/Message.js";

const getAllNonVerifiedToiletsData = async (req, res) => {
  try {
    const non_verified_toilets = await Toilet.find({
      role: "non_verified",
    }).populate([
      { path: "rating", select: "value" },
      { path: "userId", select: "email userAvatar fullname username" },
      {
        path: "multimedia",
        select: "url multimedia_type",
      },
    ]);

    const formattedToiletData = non_verified_toilets.map((toilet) =>
      toiletDataFormatter(toilet)
    );

    return res.status(200).json({
      status: 200,
      data: formattedToiletData,
      message: SuccessMessages.GET_ALL_NON_VERIFIED_TOILET_DATA_SUCCESS,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
    });
  }
};

export default getAllNonVerifiedToiletsData;
