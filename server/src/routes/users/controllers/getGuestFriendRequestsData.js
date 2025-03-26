import { UserNotifications } from "../../../models/index.js";
import userFriendRequestsFormatter from "../../../utils/helperFunctions/formatter/userFriendsRequestsFormatter.js";
import {
  ErrorMessages,
  SuccessMessages,
} from "../../../utils/constants/Message.js";

const getGuestFriendRequestsData = async (req, res) => {
  try {
    const { userId } = req.cookieValue;
    const { guestId } = req.body;

    if (userId === guestId) {
      return res.status(202).json({
        status: 202,
      });
    }

    const guestNotification = await UserNotifications.findById(
      guestId
    ).populate([
      {
        path: "notifications.user",
        select: "_id userAvatar username fullname",
      },
    ]);

    if (!guestNotification) {
      return res.status(404).json({
        status: 404,
        message: ErrorMessages.GUEST_NOT_FOUND,
      });
    }

    const guestFriendRequestList = guestNotification.notifications.filter(
      (notification) => notification.role === "friend_request"
    );

    return res.status(200).json({
      status: 200,
      data: userFriendRequestsFormatter(guestFriendRequestList.notifications),
      message: SuccessMessages.GET_GUEST_FRIEND_REQUESTS_SUCCESS,
    });
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      status: 500,
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
    });
  }
};

export default getGuestFriendRequestsData;
