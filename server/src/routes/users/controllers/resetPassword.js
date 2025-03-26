import { User } from "../../../models/index.js";
import { hashPassword } from "../../../config/bcrypt/index.js";
import { verifyToken } from "../../../config/jwt/index.js";
import {
  ErrorMessages,
  SuccessMessages,
} from "../../../utils/constants/Message.js";

const resetPassword = async (req, res) => {
  try {
    const { newPassword, token } = req.body;
    const { email } = verifyToken(token);

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({
        status: 401,
        message: ErrorMessages.USER_NOT_FOUND,
      });
    }
    user.password = hashPassword(newPassword);
    await user.save();


    return res.status(200).json({
      status: 200,
      message: SuccessMessages.RESET_PASSWORD_SUCCESS,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
    });
  }
};

export default resetPassword;
