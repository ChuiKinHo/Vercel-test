import { User, NonVerifiedUser } from "../../../models/index.js";
import {
  transporter,
  changeEmailContent,
} from "../../../config/nodemailer/index.js";
import { getToken } from "../../../config/jwt/index.js";
import Env from "../../../utils/constants/Env.js";
import {
  ErrorMessages,
  SuccessMessages,
} from "../../../utils/constants/Message.js";

const sendChangeEmailLink = async (req, res) => {
  try {
    const { newEmail } = req.body;
    const { userId, email } = req.cookieValue;

    const user = await User.findById(userId);
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

    const nonVerifiedUser = new NonVerifiedUser({
      email: newEmail,
    });
    await nonVerifiedUser.save();

    const token = getToken(
      { originalEmail: email, newEmail: newEmail },
      Env.USER_REGISTRATION_TOKEN_EXPIRES_IN
    );

    const link = `${Env.WEBSITE_DOMAIN}/change-email?token=${token}`;

    transporter.sendMail(
      changeEmailContent({
        email: email,
        link: link,
      }),
      (err, info) => {
        if (err) {
          return res.status(500).json({
            status: 500,
            message: ErrorMessages.SEND_CHANGE_EMAIL_LINK_FAILURE,
          });
        }
        return res.status(200).json({
          status: 200,
          data: { token: token },
          message: SuccessMessages.SEND_CHANGE_EMAIL_LINK_SUCCESS,
        });
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 500,
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
    });
  }
};

export default sendChangeEmailLink;
