import { cloudinary } from "../config.js";
import checkIsPresetExist from "./checkIsPresetExist.js";

const uploadFileToCloudinary = async ({ file, filename, preset, tags }) => {
  try {
    const presetConfig = await checkIsPresetExist({ preset });

    if (presetConfig) {
      const params = {
        public_id: filename,
        upload_preset: preset,
      };

      if (tags) {
        params.tags = tags;
      }

      const isVideo = file.startsWith("data:video");

      const result = isVideo
        ? await cloudinary.uploader.upload_large(file, {
            resource_type: "video",
            ...params,
          })
        : await cloudinary.uploader.upload(file, params);

      return result?.secure_url;
    }
  } catch (err) {
    return null;
  }
};

export default uploadFileToCloudinary;
