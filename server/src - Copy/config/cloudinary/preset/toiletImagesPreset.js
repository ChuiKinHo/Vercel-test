import { cloudinary, CloudinaryFolder } from "../config.js";
import checkIsPresetExist from "../functions/checkIsPresetExist.js";

const toiletImagesFolderPreset = async () => {
  try {
    const presetConfig = await checkIsPresetExist({
      preset: CloudinaryFolder.ToiletImages.preset,
    });

    if (!presetConfig) {
      await cloudinary.api.create_upload_preset({
        name: CloudinaryFolder.ToiletImages.preset,
        folder: CloudinaryFolder.ToiletImages.name,
        unsigned: true,
        use_filename: false,
        unique_filename: true,
        allowed_formats: "jpg, png, svg, webp",
      });
      console.log(
        `Cloudinary: "${CloudinaryFolder.ToiletImages.name}_preset" is added`
      );
    }
  } catch (err) {
    console.log(err);
  }
};

export default toiletImagesFolderPreset;
