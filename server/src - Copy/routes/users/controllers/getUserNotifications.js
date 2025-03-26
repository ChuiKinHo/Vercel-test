import { UserNotifications } from "../../../models/index.js";
import userNotificationsFormatter from "../../../utils/helperFunctions/formatter/userNotificationsFormatter.js";
import {
  ErrorMessages,
  SuccessMessages,
} from "../../../utils/constants/Message.js";

const getUserNotifications = async (req, res) => {
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

    return res.status(200).json({
      status: 200,
      data: userNotificationsFormatter(userNotification.notifications),
      message: SuccessMessages.GET_USER_NOTIFICATIONS_SUCCESS,
    });
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      status: 500,
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
    });
  }
};

export default getUserNotifications;
