import { User, NonVerifiedUser } from "../../../models/index.js";
import {
  transporter,
  emailVerificationContent,
} from "../../../config/nodemailer/index.js";
import { hashPassword } from "../../../config/bcrypt/index.js";
import { generateVerificationCode } from "../../../config/uuid/index.js";
import { getToken } from "../../../config/jwt/index.js";
import {
  ErrorMessages,
  SuccessMessages,
} from "../../../utils/constants/Message.js";
import Env from "../../../utils/constants/Env.js";

const sendEmailVerificationCode = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({
        status: 400,
        message: ErrorMessages.USER_ALREADY_EXIST,
      });
    }

    const verificationCode = generateVerificationCode();

    const existingNonVerifiedUser = await NonVerifiedUser.findOne({
      email: email,
    });
    if (existingNonVerifiedUser) {
      await NonVerifiedUser.deleteOne({ _id: existingNonVerifiedUser._id });
    }

    const nonVerifiedUser = new NonVerifiedUser({
      email: email,
      code: verificationCode,
    });
    await nonVerifiedUser.save();

    const token = getToken(
      { email: email, password: hashPassword(password) },
      Env.USER_REGISTRATION_TOKEN_EXPIRES_IN
    );

    transporter.sendMail(
      emailVerificationContent({
        email: email,
        verificationCode: verificationCode,
      }),
      (err, info) => {
        if (err) {
          return res.status(500).json({
            status: 500,
            message: ErrorMessages.SEND_VERIFICATION_CODE_FAILURE,
          });
        }
        console.log(`Your verification code is: ${verificationCode}`);
        res.cookie(Env.USER_REGISTRATION_TOKEN_COOKIE, token, {
          maxAge: Env.USER_REGISTRATION_TOKEN_COOKIE_EXPIRES_IN * 60 * 1000, // in millisecond
          httpOnly: true,
          secure: true,
          sameSite: "none",
        });
        return res.status(200).json({
          status: 200,
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

export default sendEmailVerificationCode;
