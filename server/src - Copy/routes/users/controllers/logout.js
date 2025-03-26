import Env from "../../../utils/constants/Env.js";
import {
  ErrorMessages,
  SuccessMessages,
} from "../../../utils/constants/Message.js";

const logout = async (req, res) => {
  try {
    res.clearCookie(Env.USER_LOGIN_TOKEN_COOKIE);
    return res.status(200).json({
      status: 200,
      message: SuccessMessages.LOGOUT_SUCCESS,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ status: 500, message: ErrorMessages.INTERNAL_SERVER_ERROR });
  }
};

export default logout;
