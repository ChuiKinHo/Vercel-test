import { User, UserNotifications } from "../../../models/index.js";
import userDataFormatter from "../../../utils/helperFunctions/formatter/userDataFormatter.js";
import getImageURLByTag from "../../../config/cloudinary/functions/getImageURLByTag.js";
import { getToken } from "../../../config/jwt/index.js";
import Env from "../../../utils/constants/Env.js";
import {
  ErrorMessages,
  SuccessMessages,
} from "../../../utils/constants/Message.js";

const loginAsGuest = async (req, res) => {
  try {
    const defaultUserAvatar = await getImageURLByTag({
      filename: "default_user_avatar",
      tag: "default_user_avatar",
    });
    const defaultUserBanner = await getImageURLByTag({
      filename: "default_user_banner",
      tag: "default_user_banner",
    });

    const newUser = new User({
      role: "guest_user",
      userAvatar: defaultUserAvatar,
      userBanner: defaultUserBanner,
    });
    await newUser.save();

    const newUserNotifications = new UserNotifications({
      _id: newUser._id,
    });
    await newUserNotifications.save();

    const token = getToken(
      {
        userId: newUser._id,
        email: newUser.email,
      },
      Env.USER_LOGIN_TOKEN_EXPIRES_IN
    );

    res.cookie(Env.USER_LOGIN_TOKEN_COOKIE, token, {
      maxAge: Env.USER_LOGIN_TOKEN_COOKIE_EXPIRES_IN * 60 * 1000, // in millisecond
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res.status(200).json({
      status: 200,
      data: userDataFormatter(newUser),
      message: SuccessMessages.LOGIN_SUCCESS,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ status: 500, message: ErrorMessages.INTERNAL_SERVER_ERROR });
  }
};

export default loginAsGuest;
