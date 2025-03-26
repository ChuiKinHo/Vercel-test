import {
  Toilet,
  Multimedia,
  Comments,
  User,
  UserNotifications,
} from "../../../models/index.js";
import toiletDataFormatter from "../../../utils/helperFunctions/formatter/toiletDataFormatter.js";
import {
  ErrorMessages,
  SuccessMessages,
} from "../../../utils/constants/Message.js";

const addMultimediaComment = async (req, res) => {
  try {
    const { multimediaId, comment, toiletId } = req.body;
    const { userId } = req.cookieValue;

    const multimedia = await Multimedia.findById(multimediaId).populate([
      {
        path: "comments",
        select: "_id text createdAt",
        populate: {
          path: "userId",
          select: "_id username fullname userAvatar",
        },
      },
    ]);
    if (!multimedia) {
      return res.status(404).json({
        status: 404,
        message: ErrorMessages.MULTIMEDIA_NOT_FOUND,
      });
    }

    const newComment = new Comments({
      userId: userId,
      text: comment,
    });
    await newComment.save();

    await newComment.populate({
      path: "userId",
      select: "_id username fullname userAvatar",
    });

    multimedia.comments.push(newComment);
    await multimedia.save();

    const toilet = await Toilet.findById(toiletId).populate([
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
    if (!toilet) {
      return res.status(404).json({
        status: 404,
        message: ErrorMessages.TOILET_NOT_FOUND,
      });
    }

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
    const weeklyAddMultimediaCommentTask = user.tasks.find(
      (task) =>
        task.title === "add-multimedia-comment" && task.category === "weekly"
    );
    if (weeklyAddMultimediaCommentTask) {
      if (
        !weeklyAddMultimediaCommentTask.isCompleted ||
        currentTime.getTime() -
          weeklyAddMultimediaCommentTask.last_completed_at.getTime() >=
          weeklyAddMultimediaCommentTask.cooldown
      ) {
        user.coins += weeklyAddMultimediaCommentTask.coins;
        weeklyAddMultimediaCommentTask.last_completed_at = currentTime;
        weeklyAddMultimediaCommentTask.isCompleted = true;
        await weeklyAddMultimediaCommentTask.save();

        // Notify user
        userNotification.notifications.push({
          role: "coins_announcement",
          user: admin._id,
          value: weeklyAddMultimediaCommentTask.coins,
        });
        await userNotification.save();
      }
    }
    await user.save();

    return res.status(200).json({
      status: 200,
      data: {
        selectedToilet: toiletDataFormatter(toilet),
        selectedMultimedia: multimedia,
      },
      message: SuccessMessages.ADD_COMMENT_SUCCESS,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 500,
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
    });
  }
};

export default addMultimediaComment;
