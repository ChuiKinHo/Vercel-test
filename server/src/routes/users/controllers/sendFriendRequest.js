import { User, UserNotifications } from "../../../models/index.js";
import {
  ErrorMessages,
  SuccessMessages,
} from "../../../utils/constants/Message.js";

const sendFriendRequest = async (req, res) => {
  try {
    const { guestId } = req.body;
    const { userId } = req.cookieValue;

    const user = await User.findById(userId);
    const userNotification = await UserNotifications.findById(userId);
    if (!user || !userNotification) {
      return res.status(404).json({
        status: 404,
        message: ErrorMessages.USER_NOT_FOUND,
      });
    }
    const guest = await User.findById(guestId);
    const guestNotification = await UserNotifications.findById(guestId);
    if (!guest || !guestNotification) {
      return res.status(404).json({
        status: 404,
        message: ErrorMessages.GUEST_NOT_FOUND,
      });
    }

    // Check if they are friends
    if (user.friends.includes(guestId.toString())) {
      return res.status(409).json({
        status: 409,
        message: ErrorMessages.ALREADY_FRIEND,
      });
    }

    // Check if the notification is sent to guest already
    const guestFriendRequestList = guestNotification.notifications
      .filter((notification) => notification.role === "friend_request")
      .map((notification) => notification.user.toString());

      console.log(guestFriendRequestList.includes(userId.toString()))

    if (guestFriendRequestList.includes(userId.toString())) {
      return res.status(409).json({
        status: 409,
        message: ErrorMessages.FRIEND_REQUEST_ALREADY_SENT,
      });
    }

    // Add notification to guest
    guestNotification.notifications.push({
      role: "friend_request",
      user: userId,
    });
    await guestNotification.save();
    
    return res.status(200).json({
      status: 200,
      message: SuccessMessages.SEND_FRIEND_REQUEST_SUCCESS,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ status: 500, message: ErrorMessages.INTERNAL_SERVER_ERROR });
  }
};

export default sendFriendRequest;
