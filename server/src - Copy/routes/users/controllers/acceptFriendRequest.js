import { UserNotifications, User } from "../../../models/index.js";
import userFriendsDataFormatter from "../../../utils/helperFunctions/formatter/userFriendsDataFormatter.js";
import userNotificationsFormatter from "../../../utils/helperFunctions/formatter/userNotificationsFormatter.js";
import userDataFormatter from "../../../utils/helperFunctions/formatter/userDataFormatter.js";
import {
  ErrorMessages,
  SuccessMessages,
} from "../../../utils/constants/Message.js";

const acceptFriendRequest = async (req, res) => {
  try {
    const { userId } = req.cookieValue;
    const { guestId } = req.body;

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
    const guest = await User.findById(guestId);
    const guestNotification = await UserNotifications.findById(guestId);
    if (!guest || !guestNotification) {
      return res.status(404).json({
        status: 404,
        message: ErrorMessages.GUEST_NOT_FOUND,
      });
    }

    // Check if they are friends
    if (guest.friends.includes(userId)) {
      return res.status(409).json({
        status: 409,
        message: ErrorMessages.ALREADY_FRIEND,
      });
    }

    // Remove the "friend_request" notification from user
    userNotification.notifications = userNotification.notifications.filter(
      (notification) =>
        notification.role !== "friend_request" &&
        notification.user._id !== guestId.toString()
    );

    // Add Friend
    guest.friends.push(userId);

    // Add the "friend_accept" notification to guest
    guestNotification.notifications.push({
      role: "friend_accept",
      user: userId,
    });

    // Update follower of the user
    user.followers.push(guestId);

    await userNotification.save();
    await guestNotification.save();
    await user.save();
    await guest.save();

    return res.status(200).json({
      status: 200,
      data: userNotificationsFormatter(userNotification.notifications),
      message: SuccessMessages.FRIEND_REQUEST_ACCEPTED,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
    });
  }
};

export default acceptFriendRequest;
