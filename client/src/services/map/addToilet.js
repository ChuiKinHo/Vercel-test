import axios from "axios";
import { addToiletSchema } from "@utils/validationSchema/globalSchema";
import LOCAL_STORAGE_KEYS from "@utils/constants/LocalStorageKeys";
import API_ROUTE_PATHS from "@utils/constants/ApiRoutes";

const addToilet = async ({
  address,
  area,
  district,
  sub_district,
  type_of_toilet,
  isMale,
  isFemale,
  isDisabled,
  haveBathroom,
  rating,
  toilet_images,
  toilet_videos,
  latitude,
  longitude,
}) => {
  const dataValidation = await addToiletSchema.validate({
    address,
    area,
    district,
    sub_district,
    type_of_toilet,
    isMale,
    isFemale,
    isDisabled,
    haveBathroom,
    rating,
    toilet_images,
    toilet_videos,
    latitude,
    longitude,
  });
  if (!dataValidation) {
    return { status: 403, message: "Data Validation Fails" };
  }

  const currentLanguage =
    localStorage.getItem(LOCAL_STORAGE_KEYS.LANGUAGE) || "en_us";

  const res = await axios.post(
    API_ROUTE_PATHS.addToilet,
    {
      address,
      area,
      district,
      sub_district,
      type_of_toilet,
      isMale,
      isFemale,
      isDisabled,
      haveBathroom,
      rating,
      toilet_images,
      toilet_videos,
      latitude,
      longitude,
      language: currentLanguage,
    },
    { withCredentials: true }
  );
  return res.data;
};

export default addToilet;
