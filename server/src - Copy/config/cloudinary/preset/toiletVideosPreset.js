import { cloudinary, CloudinaryFolder } from "../config.js";
import checkIsPresetExist from "../functions/checkIsPresetExist.js";

const toiletVideosFolderPreset = async () => {
  try {
    const presetConfig = await checkIsPresetExist({
      preset: CloudinaryFolder.ToiletVideos.preset,
    });

    if (!presetConfig) {
      await cloudinary.api.create_upload_preset({
        name: CloudinaryFolder.ToiletVideos.preset,
        folder: CloudinaryFolder.ToiletVideos.name,
        unsigned: true,
        use_filename: false,
        unique_filename: true,
        allowed_formats: "mp4, webm",
      });
      console.log(
        `Cloudinary: "${CloudinaryFolder.ToiletVideos.name}_preset" is added`
      );
    }
  } catch (err) {
    console.log(err);
  }
};

export default toiletVideosFolderPreset;
