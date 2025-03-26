import { Toilet, User, UserNotifications } from "../../../models/index.js";
import toiletDataFormatter from "../../../utils/helperFunctions/formatter/toiletDataFormatter.js";

import {
  ErrorMessages,
  SuccessMessages,
} from "../../../utils/constants/Message.js";

const updateToiletViews = async (req, res) => {
  try {
    const { toiletId, update } = req.body;
    const { userId } = req.cookieValue || {};

    const updatedToilet = await Toilet.findByIdAndUpdate(
      toiletId,
      { $inc: { views: update ? 1 : 0 } },
      { new: true }
    ).populate([
      { path: "rating", select: "_id userId value" },
      {
        path: "comments",
        select: "_id text createdAt",
        populate: {
          path: "userId",
          select: "_id username fullname userAvatar",
        },
      },
      {
        path: "multimedia",
        select: "_id userId multimedia_type url likes comments",
        populate: {
          path: "comments",
          select: "_id userId text createdAt",
          populate: {
            path: "userId",
            select: "_id username fullname userAvatar",
          },
        },
      },
    ]);

    if (!updatedToilet) {
      return res.status(404).json({
        status: 404,
        message: ErrorMessages.TOILET_NOT_FOUND,
      });
    }

    if (userId) {
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

      // Check the completion of daily view toilet task
      const currentTime = new Date();
      const dailyViewToiletTask = user.tasks.find(
        (task) => task.title === "view-toilet" && task.category === "daily"
      );
      if (dailyViewToiletTask) {
        if (
          !dailyViewToiletTask.isCompleted ||
          currentTime.getTime() -
            dailyViewToiletTask.last_completed_at.getTime() >=
            dailyViewToiletTask.cooldown
        ) {
          user.coins += dailyViewToiletTask.coins;
          dailyViewToiletTask.last_completed_at = currentTime;
          dailyViewToiletTask.isCompleted = true;

          user.markModified("tasks");
          await user.save();

          // Notify user
          userNotification.notifications.push({
            role: "coins_announcement",
            user: admin._id,
            value: dailyViewToiletTask.coins,
          });
          await userNotification.save();
        }
      }
    }

    return res.status(200).json({
      status: 200,
      data: toiletDataFormatter(updatedToilet),
      message: SuccessMessages.UPDATE_TOILET_RATING_SUCCESS,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
    });
  }
};

export default updateToiletViews;
