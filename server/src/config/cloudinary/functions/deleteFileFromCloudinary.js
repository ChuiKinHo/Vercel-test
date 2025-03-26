import { cloudinary } from "../config.js";
import { extractPublicId } from 'cloudinary-build-url'

const deleteFileFromCloudinary = async ({ url }) => {
  const publicId = extractPublicId(url);
  await cloudinary.uploader.destroy(publicId);
};

export default deleteFileFromCloudinary;
