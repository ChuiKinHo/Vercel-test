import { cloudinary, CloudinaryFolder } from "../config.js";
import checkIsPresetExist from "../functions/checkIsPresetExist.js";
import uploadFileToCloudinary from "../functions/uploadFileToCloudinary.js";
import path from "path";

const defaultUserBannerImagePath = path.join(
  process.cwd(),
  "src/config/cloudinary/assets/default_user_banner.jpg"
);

const userBannerFolderPreset = async () => {
  try {
    const presetConfig = await checkIsPresetExist({
      preset: CloudinaryFolder.UserBanner.preset,
    });

    if (!presetConfig) {
      await cloudinary.api.create_upload_preset({
        name: CloudinaryFolder.UserBanner.preset,
        folder: CloudinaryFolder.UserBanner.name,
        unsigned: true,
        use_filename: false,
        unique_filename: true,
        allowed_formats: "jpg, png, svg, webp",
      });
      console.log(
        `Cloudinary: "${CloudinaryFolder.UserBanner.name}_preset" is added`
      );

      await uploadFileToCloudinary({
        file: defaultUserBannerImagePath,
        filename: "default_user_banner",
        preset: CloudinaryFolder.UserBanner.preset,
        tags: "default_user_banner",
      });

      console.log(
        `Cloudinary: Default user banner image is uploaded to "${CloudinaryFolder.UserBanner.name}" folder`
      );
    }
  } catch (err) {
    console.log(err);
  }
};

export default userBannerFolderPreset;
