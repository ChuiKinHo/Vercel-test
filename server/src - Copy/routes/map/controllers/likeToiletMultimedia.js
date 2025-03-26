import { Toilet, Multimedia } from "../../../models/index.js";
import toiletDataFormatter from "../../../utils/helperFunctions/formatter/toiletDataFormatter.js";
import {
  ErrorMessages,
  SuccessMessages,
} from "../../../utils/constants/Message.js";

const likeToiletMultimedia = async (req, res) => {
  try {
    const { multimediaId, toiletId } = req.body;
    const { userId } = req.cookieValue;

    const multimedia = await Multimedia.findById(multimediaId).populate([
      {
        path: "comments",
        select: "userId text",
      },
    ]);
    if (!multimedia) {
      return res.status(404).json({
        status: 404,
        message: ErrorMessages.MULTIMEDIA_NOT_FOUND,
      });
    }

    // Check if user like the multimedia
    const userIndex = multimedia.likes.findIndex(
      (user) => user.toString() === userId
    );

    if (userIndex === -1) {
      // Like
      multimedia.likes.push(userId);
    } else {
      // Dislike
      multimedia.likes.splice(userIndex, 1);
    }
    await multimedia.save();

    const toilet = await Toilet.findById(toiletId).populate([
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
    if (!toilet) {
      return res.status(404).json({
        status: 404,
        message: ErrorMessages.TOILET_NOT_FOUND,
      });
    }


    return res.status(200).json({
      status: 200,
      data: {
        selectedToilet: toiletDataFormatter(toilet),
        selectedMultimedia: multimedia,
      },
      message:
        userIndex === -1
          ? SuccessMessages.LIKE_SUCCESS
          : SuccessMessages.DISLIKE_SUCCESS,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
    });
  }
};

export default likeToiletMultimedia;
