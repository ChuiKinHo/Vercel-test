import { cloudinary } from "../config.js";

const getImageURLByTag = async ({ filename, tag }) => {
  try {
    const assets = await cloudinary.api.resources_by_tag(tag);
    if (assets) {
      const result = assets.resources.filter(
        (asset) => asset.display_name === filename
      );
      if (result && result.length === 1) {
        return result[0].secure_url;
      }
      return null;
    }
    return null;
  } catch (err) {
    return null;
  }
};

export default getImageURLByTag;
