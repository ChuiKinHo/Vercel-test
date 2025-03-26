import { cloudinary } from "../config.js";

const checkIsPresetExist = async ({ preset }) => {
  try {
    const presetConfig = await cloudinary.api.upload_preset(preset);
    return presetConfig;
  } catch (err) {
    return null;
  }
};

export default checkIsPresetExist;