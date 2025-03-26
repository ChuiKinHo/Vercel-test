import { User } from "../../../models/index.js";
import userDataFormatter from "../../../utils/helperFunctions/formatter/userDataFormatter.js";
import {
  ErrorMessages,
  SuccessMessages,
} from "../../../utils/constants/Message.js";

const changeUserPreferenceFontSize = async (req, res) => {
  try {
    const { userId } = req.cookieValue;
    const { preference_font_size } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          preference_font_size: preference_font_size,
        },
      },
      { new: true }
    );

    if (!user) {
      return res.status(400).json({
        status: 400,
        message: ErrorMessages.USER_NOT_FOUND,
      });
    }

    await user.populate([
      {
        path: "exchange_records",
        select: "reward exchanged_at",
        populate: {
          path: "reward",
          select: "name_en name_zh required_coins image",
        },
      },
      {
        path: "toilet_bookmarks",
        select:
          "_id name_zh name_en address_zh address_en district_zh district_en location rating views comments",
      },
      {
        path: "tasks",
        select:
          "_id title category description coins last_completed_at cooldown isCompleted",
      },
    ]);

    return res.status(200).json({
      status: 200,
      data: userDataFormatter(user),
      message: SuccessMessages.CHANGE_USER_PREFERENCE_LANGUAGE_SUCCESS,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
    });
  }
};

export default changeUserPreferenceFontSize;
