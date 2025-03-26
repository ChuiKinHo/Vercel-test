import { User, UserNotifications } from "../../../models/index.js";
import userDataFormatter from "../../../utils/helperFunctions/formatter/userDataFormatter.js";
import {
  ErrorMessages,
  SuccessMessages,
} from "../../../utils/constants/Message.js";

const editPersonalDetails = async (req, res) => {
  try {
    const { fullname, username, email, phone, location, tel_country_code } =
      req.body;
    const { userId } = req.cookieValue;

    const user = await User.findById(userId).populate([
      {
        path: "tasks",
        select:
          "_id title category description coins due_date last_completed_at cooldown isCompleted",
      },
    ]);
    const userNotification = await UserNotifications.findById(userId);
    if (!user || !userNotification) {
      return res.status(404).json({
        status: 404,
        message: ErrorMessages.USER_NOT_FOUND,
      });
    }

    const admin = await User.findOne({ role: "admin" });

    // Update the newest profile details
    user.fullname = fullname;
    user.username = username;
    user.phone = phone;
    user.location = location;
    user.tel_country_code = tel_country_code;

    // Check the completion of daily view toilet task
    const currentTime = new Date();
    const oneTimeEditProfileTask = user.tasks.find(
      (task) => task.title === "edit-profile" && task.category === "one-time"
    );
    if (oneTimeEditProfileTask) {
      if (
        !oneTimeEditProfileTask.isCompleted ||
        currentTime.getTime() -
          oneTimeEditProfileTask.last_completed_at.getTime() >=
          oneTimeEditProfileTask.cooldown
      ) {
        user.coins += oneTimeEditProfileTask.coins;
        oneTimeEditProfileTask.last_completed_at = currentTime;
        oneTimeEditProfileTask.isCompleted = true;
        await oneTimeEditProfileTask.save();

        // Notify user
        userNotification.notifications.push({
          role: "coins_announcement",
          user: admin._id,
          value: oneTimeEditProfileTask.coins,
        });
        await userNotification.save();
      }
    }
    await user.save();

    return res.status(200).json({
      status: 200,
      data: userDataFormatter(user),
      message: SuccessMessages.EDIT_PERSONAL_DETAILS_SUCCESS,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
    });
  }
};

export default editPersonalDetails;
