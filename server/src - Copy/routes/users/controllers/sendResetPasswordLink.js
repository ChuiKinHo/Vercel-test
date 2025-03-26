import { User } from "../../../models/index.js";
import {
  transporter,
  resetPasswordContent,
} from "../../../config/nodemailer/index.js";
import { getToken } from "../../../config/jwt/index.js";
import Env from "../../../utils/constants/Env.js";
import {
  ErrorMessages,
  SuccessMessages,
} from "../../../utils/constants/Message.js";

const sendResetPasswordLink = async (req, res) => {
  try {
    const { email } = req.body;
    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      return res.status(400).json({
        status: 400,
        message: ErrorMessages.USER_NOT_FOUND,
      });
    }

    const token = getToken({ email: email }, Env.USER_RESET_PASSWORD_TOKEN_EXPIRES_IN);
    const link = `${Env.WEBSITE_DOMAIN}/reset-password?token=${token}`;

    transporter.sendMail(
      resetPasswordContent({ email: email, link: link }),
      (err, info) => {
        if (err) {
          return res.status(500).json({
            status: 500,
            message: ErrorMessages.SEND_VERIFICATION_CODE_FAILURE,
          });
        }
        return res.status(200).json({
          status: 200,
          data: { token: token },
          message: SuccessMessages.SEND_VERIFICATION_CODE_SUCCESS,
        });
      }
    );
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
    });
  }
};

export default sendResetPasswordLink;
