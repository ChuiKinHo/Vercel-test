import {
  Toilet,
  Comments,
  User,
  UserNotifications,
} from "../../../models/index.js";
import toiletDataFormatter from "../../../utils/helperFunctions/formatter/toiletDataFormatter.js";
import {
  ErrorMessages,
  SuccessMessages,
} from "../../../utils/constants/Message.js";

const addToiletComment = async (req, res) => {
  try {
    const { toiletId, comment } = req.body;
    const { userId } = req.cookieValue;

    const toilet = await Toilet.findById(toiletId);

    if (!toilet) {
      return res.status(404).json({
        status: 404,
        message: ErrorMessages.TOILET_NOT_FOUND,
      });
    }

    const newComment = new Comments({
      userId: userId,
      text: comment,
    });
    await newComment.save();

    toilet.comments.push(newComment._id);
    await toilet.save();

    const updatedToilet = await Toilet.findById(toiletId).populate([
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
    const weeklyAddToiletCommentTask = user.tasks.find(
      (task) =>
        task.title === "add-toilet-comment" && task.category === "weekly"
    );
    if (weeklyAddToiletCommentTask) {
      if (
        !weeklyAddToiletCommentTask.isCompleted ||
        currentTime.getTime() -
          weeklyAddToiletCommentTask.last_completed_at.getTime() >=
          weeklyAddToiletCommentTask.cooldown
      ) {
        user.coins += weeklyAddToiletCommentTask.coins;
        weeklyAddToiletCommentTask.last_completed_at = currentTime;
        weeklyAddToiletCommentTask.isCompleted = true;
        await weeklyAddToiletCommentTask.save();

        // Notify user
        userNotification.notifications.push({
          role: "coins_announcement",
          user: admin._id,
          value: weeklyAddToiletCommentTask.coins,
        });
        await userNotification.save();
      }
    }
    await user.save();

    return res.status(200).json({
      status: 200,
      data: toiletDataFormatter(updatedToilet),
      message: SuccessMessages.GET_TOILET_NEARBY_SUCCESS,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
    });
  }
};

export default addToiletComment;
