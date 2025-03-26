import { User, NonVerifiedUser } from "../../../models/index.js";
import { verifyToken } from "../../../config/jwt/index.js";
import Env from "../../../utils/constants/Env.js";
import {
  ErrorMessages,
  SuccessMessages,
} from "../../../utils/constants/Message.js";

const changeEmail = async (req, res) => {
  try {
    const { token } = req.body;
    const { originalEmail, newEmail } = verifyToken(token);

    const user = await User.findOne({ email: originalEmail });
    if (!user) {
      return res.status(401).json({
        status: 401,
        message: ErrorMessages.USER_NOT_FOUND,
      });
    }

    const userExist = await User.findOne({ email: newEmail });
    if (userExist) {
      return res.status(401).json({
        status: 401,
        message: ErrorMessages.USER_ALREADY_EXIST,
      });
    }

    const nonVerifiedUser = await NonVerifiedUser.findOne({ email: newEmail });
    if (!nonVerifiedUser) {
      return res.status(401).json({
        status: 401,
        message: ErrorMessages.CHANGE_EMAIL_LINK_EXPIRES,
      });
    } else {
      user.email = newEmail;
      await user.save();
      res.clearCookie(Env.USER_LOGIN_TOKEN_COOKIE);

      return res.status(200).json({
        status: 200,
        message: SuccessMessages.CHANGE_EMAIL_SUCCESS,
      });
    }
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
    });
  }
};

export default changeEmail;
