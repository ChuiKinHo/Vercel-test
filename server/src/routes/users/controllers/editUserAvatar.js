import { User, UserNotifications } from "../../../models/index.js";
import userDataFormatter from "../../../utils/helperFunctions/formatter/userDataFormatter.js";
import { CloudinaryFolder } from "../../../config/cloudinary/config.js";
import { uploadFileToCloudinary } from "../../../config/cloudinary/index.js";
import {
  ErrorMessages,
  SuccessMessages,
} from "../../../utils/constants/Message.js";

const acceptMimeTypes = [
  "image/png",
  "image/jpeg",
  "image/svg+xml",
  "image/webp",
];

const editUserAvatar = async (req, res) => {
  try {
    const { upload: userAvatarBase64, fileMimeType } = req.body;
    const { userId } = req.cookieValue;

    if (!acceptMimeTypes.includes(fileMimeType)) {
      return res.status(400).json({
        status: 400,
        message: ErrorMessages.INVALID_FILE_FORMAT,
      });
    }

    const userAvatar = await uploadFileToCloudinary({
      file: userAvatarBase64,
      filename: `${userId}_user_avatar`,
      preset: CloudinaryFolder.UserAvatar.preset,
    });

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

    // Update the newest user avatar
    user.userAvatar = userAvatar;

    // Check the completion of daily view toilet task
    const currentTime = new Date();
    const oneTimeEditUserAvatarTask = user.tasks.find(
      (task) =>
        task.title === "edit-user-avatar" && task.category === "one-time"
    );
    if (oneTimeEditUserAvatarTask) {
      if (
        !oneTimeEditUserAvatarTask.isCompleted ||
        currentTime.getTime() -
          oneTimeEditUserAvatarTask.last_completed_at.getTime() >=
          oneTimeEditUserAvatarTask.cooldown
      ) {
        user.coins += oneTimeEditUserAvatarTask.coins;
        oneTimeEditUserAvatarTask.last_completed_at = currentTime;
        oneTimeEditUserAvatarTask.isCompleted = true;
        await oneTimeEditUserAvatarTask.save();

        // Notify user
        userNotification.notifications.push({
          role: "coins_announcement",
          user: admin._id,
          value: oneTimeEditUserAvatarTask.coins,
        });
        await userNotification.save();
      }
    }
    await user.save();

    return res.status(200).json({
      status: 200,
      data: userDataFormatter(user),
      message: SuccessMessages.EDIT_USER_AVATAR_SUCCESS,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
    });
  }
};

export default editUserAvatar;
