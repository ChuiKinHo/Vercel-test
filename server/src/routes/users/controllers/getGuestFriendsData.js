import { User } from "../../../models/index.js";
import userFriendsDataFormatter from "../../../utils/helperFunctions/formatter/userFriendsDataFormatter.js";
import {
  ErrorMessages,
  SuccessMessages,
} from "../../../utils/constants/Message.js";

const getGuestFriendsData = async (req, res) => {
  try {
    const { userId } = req.cookieValue;
    const { guestId } = req.body;

    if (userId === guestId) {
      return res.status(202).json({
        status: 202,
      });
    }
    
    const guest = await User.findById(guestId).populate([
      {
        path: "friends",
        select: "_id userAvatar username fullname",
      },
    ]);
    if (!guest) {
      return res.status(404).json({
        status: 404,
        message: ErrorMessages.GUEST_NOT_FOUND,
      });
    }

    return res.status(200).json({
      status: 200,
      data: userFriendsDataFormatter(guest.friends),
      message: SuccessMessages.GET_GUEST_FRIENDS_DATA_SUCCESS,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
    });
  }
};

export default getGuestFriendsData;
