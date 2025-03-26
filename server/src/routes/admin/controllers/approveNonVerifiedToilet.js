import {
  Toilet,
  Multimedia,
  Rating,
  UserNotifications,
  User,
} from "../../../models/index.js";
import { uploadFileToCloudinary } from "../../../config/cloudinary/index.js";
import { CloudinaryFolder } from "../../../config/cloudinary/config.js";
import {
  ErrorMessages,
  SuccessMessages,
} from "../../../utils/constants/Message.js";

const approveNonVerifiedToilet = async (req, res) => {
  try {
    const { userId: adminId } = req.cookieValue;
    const {
      toiletId,
      userId,
      address_en,
      area_en,
      district_en,
      sub_district_en,
      address_zh,
      area_zh,
      district_zh,
      sub_district_zh,
      name_en,
      name_zh,
      type_of_toilet,
      isMale,
      isFemale,
      isDisabled,
      haveBathroom,
      rating,
      toilet_images,
      toilet_videos,
      latitude,
      longitude,
      deletedMultimedia,
    } = req.body;

    console.log("toiletId = ", toiletId);

    const non_verified_toilet = await Toilet.findById(toiletId).populate([
      {
        path: "multimedia",
        select: "_id url multimedia_type",
      },
    ]);
    if (!non_verified_toilet) {
      return res.status(404).json({
        status: 404,
        message: ErrorMessages.TOILET_NOT_FOUND,
      });
    }

    // Update non-Verified toilet details
    non_verified_toilet.role = "verified";
    non_verified_toilet.name_en = name_en;
    non_verified_toilet.name_zh = name_zh;
    non_verified_toilet.address_en = address_en;
    non_verified_toilet.address_zh = address_zh;
    non_verified_toilet.area_en = area_en;
    non_verified_toilet.area_zh = area_zh;
    non_verified_toilet.district_en = district_en;
    non_verified_toilet.district_zh = district_zh;
    non_verified_toilet.sub_district_en = sub_district_en;
    non_verified_toilet.sub_district_zh = sub_district_zh;
    non_verified_toilet.type_of_toilet = type_of_toilet;
    non_verified_toilet.isMale = isMale;
    non_verified_toilet.isFemale = isFemale;
    non_verified_toilet.isDisabled = isDisabled;
    non_verified_toilet.haveBathroom = haveBathroom;
    non_verified_toilet.location = {
      type: "Point",
      coordinates: [longitude, latitude],
    };

    // Find the existing multimedia
    const existingMultimedia = non_verified_toilet.multimedia.filter(
      (multimedia) => !deletedMultimedia.includes(multimedia._id.toString())
    );
    const existingMultimediaIds = existingMultimedia.map(
      (multimedia) => multimedia._id
    );
    const existingMultimediaURLs = existingMultimedia.map(
      (multimedia) => multimedia.url
    );

    // Update existing multimedia
    for (const multimedia of existingMultimedia) {
      const multimediaURL = await uploadFileToCloudinary({
        file: multimedia.url,
        filename: `toilet_${
          multimedia.multimedia_type === "image" ? "images" : "videos"
        }/${userId}/${Date.now()}`,
        preset:
          multimedia.multimedia_type === "image"
            ? CloudinaryFolder.ToiletImages.preset
            : CloudinaryFolder.ToiletVideos.preset,
      });

      await Multimedia.findByIdAndUpdate(multimedia._id, {
        role: "verified",
        url: multimediaURL,
      });

      console.log(
        `exisiting ${multimedia.multimedia_type} id = `,
        multimedia._id,
        ` existing ${multimedia.multimedia_type} url = `,
        multimediaURL
      );
    }

    // Add New Images
    let newMultimediaIds = [];

    for (const image of toilet_images) {
      if (!existingMultimediaURLs.includes(image.file_base64)) {
        // Upload to Cloudinary
        const toiletImage = await uploadFileToCloudinary({
          file: image.file_base64,
          filename: `${userId}/${Date.now()}`,
          preset: CloudinaryFolder.ToiletImages.preset,
        });

        const newImage = new Multimedia({
          role: "verified",
          multimedia_type: "image",
          userId: userId,
          url: toiletImage,
        });
        await newImage.save();

        console.log(
          "new image id = ",
          newImage._id,
          " new image url = ",
          toiletImage
        );
        newMultimediaIds.push(newImage._id);
      }
    }

    // Add New Videos
    for (const video of toilet_videos) {
      if (!existingMultimediaURLs.includes(video.file_base64)) {
        // Upload to Cloudinary
        const toiletVideo = await uploadFileToCloudinary({
          file: video.file_base64,
          filename: `${userId}/${Date.now()}`,
          preset: CloudinaryFolder.ToiletVideos.preset,
        });

        const newVideo = new Multimedia({
          role: "verified",
          multimedia_type: "video",
          userId: userId,
          url: toiletVideo,
        });
        await newVideo.save();

        console.log(
          "new video id = ",
          newVideo._id,
          " new video url = ",
          toiletVideo
        );

        newMultimediaIds.push(newVideo._id);
      }
    }

    // Delete the multimedia
    if (deletedMultimedia.length > 0) {
      await Multimedia.deleteMany({ _id: { $in: deletedMultimedia } });
    }

    // Update toilet's multimedia in toilet modal
    non_verified_toilet.multimedia = [
      ...existingMultimediaIds,
      ...newMultimediaIds,
    ];
    console.log("multimedia ids = ", [
      ...existingMultimediaIds,
      ...newMultimediaIds,
    ]);

    // Update toilet rating
    await Rating.findByIdAndUpdate(non_verified_toilet.rating[0]._id, {
      value: rating,
    });
    await non_verified_toilet.save();

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
    const weeklyAddToiletTask = user.tasks.find(
      (task) => task.title === "add-toilet" && task.category === "weekly"
    );
    if (weeklyAddToiletTask) {
      if (
        !weeklyAddToiletTask.isCompleted ||
        currentTime.getTime() -
          weeklyAddToiletTask.last_completed_at.getTime() >=
          weeklyAddToiletTask.cooldown
      ) {
        user.coins += weeklyAddToiletTask.coins;
        weeklyAddToiletTask.last_completed_at = currentTime;
        weeklyAddToiletTask.isCompleted = true;
        await weeklyAddToiletTask.save();

        // Notify user
        userNotification.notifications.push({
          role: "coins_announcement",
          user: adminId,
          value: weeklyAddToiletTask.coins,
        });
        await userNotification.save();
      }
    }
    await user.save();

    return res.status(200).json({
      status: 200,
      message: SuccessMessages.APPROVE_NON_VERIFIED_TOILET_SUCCESS,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
    });
  }
};

export default approveNonVerifiedToilet;
