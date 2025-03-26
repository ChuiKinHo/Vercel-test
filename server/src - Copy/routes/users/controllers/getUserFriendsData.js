import { User } from "../../../models/index.js";
import userFriendsDataFormatter from "../../../utils/helperFunctions/formatter/userFriendsDataFormatter.js";
import {
  ErrorMessages,
  SuccessMessages,
} from "../../../utils/constants/Message.js";

const getUserFriendsData = async (req, res) => {
  try {
    const { userId } = req.cookieValue;

    const user = await User.findById(userId).populate([
      {
        path: "friends",
        select: "_id userAvatar username fullname",
      },
    ]);
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: ErrorMessages.USER_NOT_FOUND,
      });
    }

    return res.status(200).json({
      status: 200,
      data: userFriendsDataFormatter(user.friends),
      message: SuccessMessages.GET_USER_FRIENDS_DATA_SUCCESS,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
    });
  }
};

export default getUserFriendsData;
