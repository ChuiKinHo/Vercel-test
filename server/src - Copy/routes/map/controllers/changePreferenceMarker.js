import { User } from "../../../models/index.js";
import userDataFormatter from "../../../utils/helperFunctions/formatter/userDataFormatter.js";
import {
  ErrorMessages,
  SuccessMessages,
} from "../../../utils/constants/Message.js";

const changePreferenceMarker = async (req, res) => {
  try {
    const { userId } = req.cookieValue;
    const { preference_marker } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: ErrorMessages.USER_NOT_FOUND,
      });
    }

    user.preference_marker = preference_marker;
    await user.save();
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
      message: SuccessMessages.CHANGE_PREFERENCE_MARKER_SUCCESS,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
    });
  }
};

export default changePreferenceMarker;
