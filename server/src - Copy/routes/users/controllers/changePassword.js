import { User } from "../../../models/index.js";
import {
  hashPassword,
  checkHashPassword,
} from "../../../config/bcrypt/index.js";
import {
  ErrorMessages,
  SuccessMessages,
} from "../../../utils/constants/Message.js";

const changePassword = async (req, res) => {
  try {
    const { originalPassword, newPassword } = req.body;
    const { userId } = req.cookieValue;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({
        status: 401,
        message: ErrorMessages.USER_NOT_FOUND,
      });
    }

    const isPasswordValid = checkHashPassword(originalPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 401,
        message: ErrorMessages.ORIGINAL_PASSWORD_NOT_MATCH,
      });
    }

    const isPasswordCurrentlyUsed = checkHashPassword(
      newPassword,
      user.password
    );
    if (isPasswordCurrentlyUsed) {
      return res.status(401).json({
        status: 401,
        message: ErrorMessages.PASSWORD_IS_CURRENTLY_USED,
      });
    }

    user.password = hashPassword(newPassword);
    await user.save();

    return res.status(200).json({
      status: 200,
      message: SuccessMessages.CHANGE_PASSWORD_SUCCESS,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
    });
  }
};

export default changePassword;
