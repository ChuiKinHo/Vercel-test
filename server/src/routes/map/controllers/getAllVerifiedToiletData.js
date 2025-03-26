import { Toilet } from "../../../models/index.js";
import toiletDataFormatter from "../../../utils/helperFunctions/formatter/toiletDataFormatter.js";
import {
  ErrorMessages,
  SuccessMessages,
} from "../../../utils/constants/Message.js";

const getAllVerifiedToiletsData = async (req, res) => {
  try {
    const verified_toilets = await Toilet.find({ role: "verified" }).populate([
      { path: "rating", select: "_id userId value" },
      {
        path: "comments",
        select: "_id text createdAt",
        populate: {
          path: "userId",
          select: "_id username fullname userAvatar",
        },
      },
      {
        path: "multimedia",
        select: "_id userId multimedia_type url likes comments",
        populate: {
          path: "comments",
          select: "_id userId text createdAt",
          populate: {
            path: "userId",
            select: "_id username fullname userAvatar",
          },
        },
      },
    ]);
    const formattedToiletData = verified_toilets.map((toilet) =>
      toiletDataFormatter(toilet)
    );

    return res.status(200).json({
      status: 200,
      data: formattedToiletData,
      message: SuccessMessages.GET_ALL_VERIFIED_TOILET_DATA_SUCCESS,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
    });
  }
};

export default getAllVerifiedToiletsData;
