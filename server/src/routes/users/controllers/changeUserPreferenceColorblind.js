import { User } from "../../../models/index.js";
import userDataFormatter from "../../../utils/helperFunctions/formatter/userDataFormatter.js";
import {
  ErrorMessages,
  SuccessMessages,
} from "../../../utils/constants/Message.js";

const changeUserPreferenceColorblind = async (req, res) => {
  try {
    const { userId } = req.cookieValue;
    const { preference_colorblind } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          preference_colorblind: preference_colorblind,
        },
      },
      { new: true }
    );

    if (!user) {
      return res.status(400).json({
        status: 400,
        message: ErrorMessages.USER_NOT_FOUND,
      });
    }

    return res.status(200).json({
      status: 200,
      data: userDataFormatter(user),
      message: SuccessMessages.CHANGE_USER_PREFERENCE_COLORBLIND_SUCCESS,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
    });
  }
};

export default changeUserPreferenceColorblind;
