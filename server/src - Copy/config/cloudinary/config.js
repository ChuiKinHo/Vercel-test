import { v2 as cloudinary } from "cloudinary";
import Env from "../../utils/constants/Env.js";

cloudinary.config({
  cloud_name: Env.Cloudinary_Cloud_Name,
  api_key: Env.Cloudinary_Api_Key,
  api_secret: Env.Cloudinary_Api_Secret,
});

const root = "toiletGuide";

const CloudinaryFolder = {
  UserAvatar: { name: `${root}/user_avatar`, preset: `user_avatar_preset` },
  UserBanner: { name: `${root}/user_banner`, preset: `user_banner_preset` },
  ToiletImages: {
    name: `${root}/toilet_images`,
    preset: `toilet_images_preset`,
  },
  ToiletVideos: {
    name: `${root}/toilet_videos`,
    preset: `toilet_videos_preset`,
  },
};

export { cloudinary, CloudinaryFolder };
