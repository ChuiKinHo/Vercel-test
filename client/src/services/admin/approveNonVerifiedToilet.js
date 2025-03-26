import axios from "axios";
import API_ROUTE_PATHS from "@utils/constants/ApiRoutes";

const approveNonVerifiedToilet = async (data) => {
  console.log(data);
  
  const res = await axios.post(
    API_ROUTE_PATHS.approveNonVerifiedToilet,
    {
      toiletId: data.toiletId,
      userId: data.userId,
      address_en: data.address_en || "",
      area_en: data.area_en || "",
      district_en: data.district_en || "",
      sub_district_en: data.sub_district_en || "",
      address_zh: data.address_zh || "",
      area_zh: data.area_zh || "",
      district_zh: data.district_zh || "",
      sub_district_zh: data.sub_district_zh || "",
      name_en: data.name_en,
      name_zh: data.name_zh,
      type_of_toilet: data.type_of_toilet,
      isMale: data.isMale,
      isFemale: data.isFemale,
      isDisabled: data.isDisabled,
      haveBathroom: data.haveBathroom,
      rating: data.rating,
      toilet_images: data.toilet_images,
      toilet_videos: data.toilet_videos,
      latitude: data.latitude,
      longitude: data.longitude,
      deletedMultimedia: data.deletedMultimedia,
    },
    { withCredentials: true }
  );
  return res.data;
};

export default approveNonVerifiedToilet;
