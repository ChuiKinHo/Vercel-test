import { User } from "../../../models/index.js";
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

const editUserBanner = async (req, res) => {
  try {
    const { upload: userBannerBase64, fileMimeType } = req.body;
    const { userId } = req.cookieValue;

    if (!acceptMimeTypes.includes(fileMimeType)) {
      return res.status(400).json({
        status: 400,
        message: ErrorMessages.INVALID_FILE_FORMAT,
      });
    }

    const userBanner = await uploadFileToCloudinary({
      file: userBannerBase64,
      filename: `${userId}_user_banner`,
      preset: CloudinaryFolder.UserBanner.preset,
    });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          userBanner: userBanner,
        },
      },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(400).json({
        status: 400,
        message: ErrorMessages.USER_NOT_FOUND,
      });
    }

    return res.status(200).json({
      status: 200,
      data: userDataFormatter(updatedUser),
      message: SuccessMessages.EDIT_USER_BANNER_SUCCESS,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
    });
  }
};

export default editUserBanner;
