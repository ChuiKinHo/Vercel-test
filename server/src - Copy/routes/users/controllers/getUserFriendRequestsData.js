import { UserNotifications } from "../../../models/index.js";
import userFriendRequestsFormatter from "../../../utils/helperFunctions/formatter/userFriendsRequestsFormatter.js";
import {
  ErrorMessages,
  SuccessMessages,
} from "../../../utils/constants/Message.js";

const getUserFriendRequestsData = async (req, res) => {
  try {
    const { userId } = req.cookieValue;

    const userNotification = await UserNotifications.findById(userId).populate([
      {
        path: "notifications.user",
        select: "_id userAvatar username fullname",
      },
    ]);

    if (!userNotification) {
      return res.status(404).json({
        status: 404,
        message: ErrorMessages.USER_NOT_FOUND,
      });
    }

    const userFriendRequestList = userNotification.notifications.filter(
      (notification) => notification.role === "friend_request"
    );

    return res.status(200).json({
      status: 200,
      data: userFriendRequestsFormatter(userFriendRequestList),
      message: SuccessMessages.GET_USER_FRIEND_REQUESTS_SUCCESS,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
    });
  }
};

export default getUserFriendRequestsData;
