import { User, UserNotifications } from "../../../models/index.js";
import userNotificationsFormatter from "../../../utils/helperFunctions/formatter/userNotificationsFormatter.js";
import {
  ErrorMessages,
  SuccessMessages,
} from "../../../utils/constants/Message.js";

const cancelNotification = async (req, res) => {
  try {
    const { userId } = req.cookieValue;
    const { userId: guestId, role } = req.body;

    const user = await User.findById(userId);
    const userNotification = await UserNotifications.findById(userId).populate([
      {
        path: "notifications.user",
        select: "_id userAvatar username fullname",
      },
    ]);
    if (!user || !userNotification) {
      return res.status(404).json({
        status: 404,
        message: ErrorMessages.USER_NOT_FOUND,
      });
    }

    // Remove the notification from the user
    userNotification.notifications = userNotification.notifications.filter(
      (notification) =>
        notification.user._id.toString() !== guestId &&
        notification.role !== role
    );
    await userNotification.save();

    return res.status(200).json({
      status: 200,
      data: userNotificationsFormatter(userNotification.notifications),
      message: SuccessMessages.CANCEL_NOTIFICATION_SUCCESS,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
    });
  }
};

export default cancelNotification;
