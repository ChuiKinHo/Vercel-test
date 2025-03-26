import { cloudinary, CloudinaryFolder } from "../config.js";
import uploadFileToCloudinary from "../functions/uploadFileToCloudinary.js";
import checkIsPresetExist from "../functions/checkIsPresetExist.js";
import path from "path";

const defaultUserAvatarImagePath = path.join(
  process.cwd(),
  "src/config/cloudinary/assets/default_user_avatar.jpg"
);

const userAvatarFolderPreset = async () => {
  try {
    const presetConfig = await checkIsPresetExist({
      preset: CloudinaryFolder.UserAvatar.preset,
    });

    if (!presetConfig) {
      await cloudinary.api.create_upload_preset({
        name: CloudinaryFolder.UserAvatar.preset,
        folder: CloudinaryFolder.UserAvatar.name,
        unsigned: true,
        use_filename: false,
        unique_filename: true,
        allowed_formats: "jpg, png, svg, webp",
      });
      console.log(
        `Cloudinary: "${CloudinaryFolder.UserAvatar.name}_preset" is added`
      );

      await uploadFileToCloudinary({
        file: defaultUserAvatarImagePath,
        filename: "default_user_avatar",
        preset: CloudinaryFolder.UserAvatar.preset,
        tags: "default_user_avatar",
      });

      console.log(
        `Cloudinary: Default user avatar image is uploaded to "${CloudinaryFolder.UserAvatar.name}" folder`
      );
    }
  } catch (err) {
    console.log(err);
  }
};

export default userAvatarFolderPreset;
