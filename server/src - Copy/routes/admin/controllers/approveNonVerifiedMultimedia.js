import {
  Toilet,
  Multimedia,
  UserNotifications,
  User,
} from "../../../models/index.js";
import { uploadFileToCloudinary } from "../../../config/cloudinary/index.js";
import { CloudinaryFolder } from "../../../config/cloudinary/config.js";
import {
  ErrorMessages,
  SuccessMessages,
} from "../../../utils/constants/Message.js";

const approveNonVerifiedMultimedia = async (req, res) => {
  try {
    const { userId: adminId } = req.cookieValue;
    const {
      toiletId,
      userId,
      toilet_images,
      toilet_videos,
      deletedMultimedia,
    } = req.body;

    console.log("toiletId = ", toiletId);

    const toilet = await Toilet.findById(toiletId);
    if (!toilet) {
      return res.status(404).json({
        status: 404,
        message: ErrorMessages.TOILET_NOT_FOUND,
      });
    }

    // Find the existing multimedia
    const existingMultimedia = [...toilet_images, ...toilet_videos];
    const existingMultimediaIds = existingMultimedia.map(
      (multimedia) => multimedia.multimediaId
    );

    // Update existing multimedia
    for (const multimedia of existingMultimedia) {
      const foundMultimedia = await Multimedia.findById(
        multimedia.multimediaId
      );

      const multimediaURL = await uploadFileToCloudinary({
        file: foundMultimedia.url,
        filename: `toilet_${
          foundMultimedia.multimedia_type === "image" ? "images" : "videos"
        }/${userId}/${Date.now()}`,
        preset:
          foundMultimedia.multimedia_type === "image"
            ? CloudinaryFolder.ToiletImages.preset
            : CloudinaryFolder.ToiletVideos.preset,
      });

      foundMultimedia.role = "verified";
      foundMultimedia.url = multimediaURL;
      await foundMultimedia.save();

      console.log(
        `exisiting ${foundMultimedia.multimedia_type} id = `,
        foundMultimedia._id,
        ` existing ${foundMultimedia.multimedia_type} url = `,
        multimediaURL
      );
    }

    // Delete the multimedia
    if (deletedMultimedia.length > 0) {
      await Multimedia.deleteMany({ _id: { $in: deletedMultimedia } });
    }

    // Update toilet's multimedia in toilet modal
    toilet.multimedia.push(...existingMultimediaIds);
    await toilet.save();

    // Check user exist
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

    // Check the completion of weekly add toilet task
    const currentTime = new Date();
    const weeklyAddToiletMultimediaTask = user.tasks.find(
      (task) =>
        task.title === "add-toilet-multimedia" && task.category === "weekly"
    );
    if (weeklyAddToiletMultimediaTask) {
      if (
        !weeklyAddToiletMultimediaTask.isCompleted ||
        currentTime.getTime() -
          weeklyAddToiletMultimediaTask.last_completed_at.getTime() >=
          weeklyAddToiletMultimediaTask.cooldown
      ) {
        user.coins += weeklyAddToiletMultimediaTask.coins;
        weeklyAddToiletMultimediaTask.last_completed_at = currentTime;
        weeklyAddToiletMultimediaTask.isCompleted = true;
        await weeklyAddToiletMultimediaTask.save();

        // Notify user
        userNotification.notifications.push({
          role: "coins_announcement",
          user: adminId,
          value: weeklyAddToiletMultimediaTask.coins,
        });
        await userNotification.save();
      }
    }
    await user.save();

    return res.status(200).json({
      status: 200,
      message: SuccessMessages.APPROVE_NON_VERIFIED_MULTIMEDIA_SUCCESS,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
    });
  }
};

export default approveNonVerifiedMultimedia;
