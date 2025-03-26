import { User } from "../../../models/index.js";
import userDataFormatter from "../../../utils/helperFunctions/formatter/userDataFormatter.js";
import {
  ErrorMessages,
  SuccessMessages,
} from "../../../utils/constants/Message.js";

const getGuestData = async (req, res) => {
  try {
    const { userId } = req.cookieValue;
    const { guestId } = req.body;

    if (userId === guestId) {
      return res.status(202).json({
        status: 202,
      });
    }

    const user = await User.findById(guestId);

    if (!user) {
      return res.status(400).json({
        status: 400,
        message: ErrorMessages.USER_NOT_FOUND,
      });
    }

    return res.status(200).json({
      status: 200,
      data: userDataFormatter(user),
      message: SuccessMessages.GET_GUEST_DATA_SUCCESS,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
    });
  }
};

export default getGuestData;
