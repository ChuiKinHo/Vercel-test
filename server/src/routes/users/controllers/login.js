import moment from "moment";
import { User, UserNotifications } from "../../../models/index.js";
import userDataFormatter from "../../../utils/helperFunctions/formatter/userDataFormatter.js";
import { checkHashPassword } from "../../../config/bcrypt/index.js";
import { getToken } from "../../../config/jwt/index.js";
import Env from "../../../utils/constants/Env.js";
import {
  ErrorMessages,
  SuccessMessages,
} from "../../../utils/constants/Message.js";

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({
        status: 401,
        message: ErrorMessages.INVALID_EMAIL_AND_PASSWORD,
      });
    }

    const isPasswordValid = checkHashPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 401,
        message: ErrorMessages.INVALID_EMAIL_AND_PASSWORD,
      });
    }

    const token = getToken(
      {
        userId: user._id,
        email: user.email,
      },
      Env.USER_LOGIN_TOKEN_EXPIRES_IN
    );

    res.cookie(Env.USER_LOGIN_TOKEN_COOKIE, token, {
      maxAge: Env.USER_LOGIN_TOKEN_COOKIE_EXPIRES_IN * 60 * 1000, // in millisecond
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    await user.populate([
      {
        path: "exchange_records",
        select: "reward exchanged_at",
        populate: {
          path: "reward",
          select: "name_en name_zh required_coins image",
        },
      },
      {
        path: "toilet_bookmarks",
        select:
          "_id name_zh name_en address_zh address_en district_zh district_en location rating views comments",
      },
      {
        path: "tasks",
        select:
          "_id title category description coins due_date last_completed_at cooldown isCompleted",
      },
    ]);

    const userNotification = await UserNotifications.findById(user._id);
    if (!userNotification) {
      return res.status(404).json({
        status: 404,
        message: ErrorMessages.USER_NOT_FOUND,
      });
    }
    const admin = await User.findOne({ role: "admin" });

    // Check the completion of daily login task
    const currentTime = new Date();
    
    const dailyLoginTask = user.tasks.find(
      (task) => task.title === "login" && task.category === "daily"
    );
    if (dailyLoginTask && user.role !== "admin") {
      if (
        !dailyLoginTask.isCompleted ||
        currentTime.getTime() -
          new Date(dailyLoginTask.last_completed_at).getTime() >=
          dailyLoginTask.cooldown
      ) {
        user.coins += dailyLoginTask.coins;
        dailyLoginTask.last_completed_at = currentTime;
        dailyLoginTask.isCompleted = true;
        await dailyLoginTask.save();

        // Notify user
        userNotification.notifications.push({
          role: "coins_announcement",
          user: admin._id,
          value: dailyLoginTask.coins,
        });
        await userNotification.save();
      }
    }

    // Construct non-duplicate weekly login history array
    const today = moment().startOf("day");
    const uniqueLogins = [
      ...new Set(
        user.login_history.map((date) =>
          moment(date).startOf("day").toISOString()
        )
      ),
    ].map((date) => moment(date));

    if (!uniqueLogins.some((date) => date.isSame(today, "day"))) {
      uniqueLogins.push(today);
    }

    uniqueLogins.sort((a, b) => a.diff(b));

    // Check the completion of weekly login task
    if (uniqueLogins.length >= 7) {
      let isConsecutive = true;
      for (let i = uniqueLogins.length - 7; i < uniqueLogins.length - 1; i++) {
        if (!uniqueLogins[i + 1].isSame(uniqueLogins[i].add(1, "day"), "day")) {
          isConsecutive = false;
          break;
        }
      }

      if (isConsecutive) {
        const weeklyLoginTask = user.tasks.find(
          (task) => task.title === "login" && task.category === "weekly"
        );

        if (weeklyLoginTask && !weeklyLoginTask.isCompleted) {
          user.coins += weeklyLoginTask.coins;
          weeklyLoginTask.last_completed_at = currentTime;
          weeklyLoginTask.isCompleted = true;

          userNotification.notifications.push({
            role: "coins_announcement",
            user: admin._id,
            value: weeklyLoginTask.coins,
          });

          await weeklyLoginTask.save();
        }
      }
    }

    // Update user login history
    user.login_history = uniqueLogins;

    await userNotification.save();
    await user.save();

    return res.status(200).json({
      status: 200,
      data: userDataFormatter(user),
      message: SuccessMessages.LOGIN_SUCCESS,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ status: 500, message: ErrorMessages.INTERNAL_SERVER_ERROR });
  }
};

export default login;
