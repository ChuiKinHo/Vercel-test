import { Toilet, Rating } from "../../../models/index.js";
import toiletDataFormatter from "../../../utils/helperFunctions/formatter/toiletDataFormatter.js";
import {
  ErrorMessages,
  SuccessMessages,
} from "../../../utils/constants/Message.js";

const updateToiletRating = async (req, res) => {
  try {
    const { rating, toiletId } = req.body;
    const { userId } = req.cookieValue;

    const toilet = await Toilet.findById(toiletId).populate("rating");
    if (!toilet) {
      return res.status(404).json({
        status: 404,
        message: ErrorMessages.TOILET_NOT_FOUND,
      });
    }

    const userRating = toilet.rating.find(
      (rating) => rating.userId.toString() === userId
    );

    if (userRating) {
      userRating.value = rating;
      await userRating.save();
    } else {
      const newRating = new Rating({
        userId: userId,
        value: rating,
      });
      await newRating.save();
      toilet.rating.push(newRating._id);
    }
    await toilet.save();

    const updatedToilet = await Toilet.findById(toiletId).populate([
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

    return res.status(200).json({
      status: 200,
      data: toiletDataFormatter(updatedToilet),
      message: SuccessMessages.UPDATE_TOILET_RATING_SUCCESS,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
    });
  }
};

export default updateToiletRating;
