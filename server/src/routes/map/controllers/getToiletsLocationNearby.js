import { Toilet } from "../../../models/index.js";
import toiletDataFormatter from "../../../utils/helperFunctions/formatter/toiletDataFormatter.js";
import {
  ErrorMessages,
  SuccessMessages,
} from "../../../utils/constants/Message.js";

const getToiletsLocationNearby = async (req, res) => {
  try {
    const { latitude, longitude, nearbyCircleRadius } = req.body;

    if (!latitude || !longitude) {
      return res
        .status(400)
        .json({ message: "Latitude and longitude are required" });
    }

    const toiletsNearby = await Toilet.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [longitude, latitude] },
          $maxDistance: nearbyCircleRadius,
        },
      },
      role: "verified",
    }).populate([
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
        select: "_id userId multimedia_type url description likes comments",
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

    const formattedToiletData = toiletsNearby.map((toilet) =>
      toiletDataFormatter(toilet)
    );

    return res.status(200).json({
      status: 200,
      data: formattedToiletData,
      message: SuccessMessages.GET_TOILET_NEARBY_SUCCESS,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
    });
  }
};

export default getToiletsLocationNearby;
