import * as Yup from "yup";
import {
  emailRule,
  passwordRule,
  confirmedPasswordRule,
  newConfirmedPasswordRule,
  codeVerificationRule,
  fullnameRule,
  usernameRule,
  phoneRule,
  locationRule,
  telCountryCodeRule,
  commentRule,
  toiletAddressRule,
  toiletAreaRule,
  toiletDistrictRule,
  toiletSubDistrictRule,
  typeOfToiletRule,
  isMaleRule,
  isFemaleRule,
  isDisabledRule,
  haveBathroomRule,
  ratingRule,
  toiletImagesRule,
  toiletVideosRule,
  toiletLatitudeRule,
  toiletLongitudeRule,
  toiletNameRule,
  toiletAddressNotRequiredRule,
  preferenceMarkerRule,
} from "./schemaRules";

const userLoginSchema = Yup.object({
  email: emailRule(),
  password: passwordRule(),
});

const userRegisterSchema = Yup.object({
  email: emailRule(),
  password: passwordRule(),
  confirmedPassword: confirmedPasswordRule(),
});

const codeVerificationSchema = Yup.object({
  code: codeVerificationRule(),
});

const emailSchema = Yup.object({
  email: emailRule(),
});

const resetPasswordSchema = Yup.object({
  newPassword: passwordRule(),
  newConfirmedPassword: newConfirmedPasswordRule(),
});

const personalDetailsSchema = Yup.object({
  fullname: fullnameRule(),
  username: usernameRule(),
  phone: phoneRule(),
  location: locationRule(),
  tel_country_code: telCountryCodeRule(),
});

const changePasswordSchema = Yup.object({
  originalPassword: passwordRule(),
  newPassword: passwordRule(),
  newConfirmedPassword: newConfirmedPasswordRule(),
});

const changeEmailSchema = Yup.object({
  originalEmail: emailRule(),
  newEmail: emailRule(),
});

const commentSchema = Yup.object({
  comment: commentRule(),
});

const addToiletSchema = Yup.object({
  address: toiletAddressRule(),
  area: toiletAreaRule(),
  district: toiletDistrictRule(),
  sub_district: toiletSubDistrictRule(),
  type_of_toilet: typeOfToiletRule(),
  isMale: isMaleRule(),
  isFemale: isFemaleRule(),
  isDisabled: isDisabledRule(),
  haveBathroom: haveBathroomRule(),
  rating: ratingRule(),
  toilet_images: toiletImagesRule(),
  toilet_videos: toiletVideosRule(),
  latitude: toiletLatitudeRule(),
  longitude: toiletLongitudeRule(),
});

const addToiletMultimediaSchema = Yup.object({
  toilet_images: toiletImagesRule(),
  toilet_videos: toiletVideosRule(),
});

const adminToiletVerificationSchema = Yup.object({
  address_en: toiletAddressNotRequiredRule(),
  area_en: toiletAreaRule(),
  district_en: toiletDistrictRule(),
  sub_district_en: toiletSubDistrictRule(),
  address_zh: toiletAddressNotRequiredRule(),
  area_zh: toiletAreaRule(),
  district_zh: toiletDistrictRule(),
  sub_district_zh: toiletSubDistrictRule(),
  name_en: toiletNameRule(),
  name_zh: toiletNameRule(),
  address: toiletAddressRule(),
  area: toiletAreaRule(),
  district: toiletDistrictRule(),
  sub_district: toiletSubDistrictRule(),
  type_of_toilet: typeOfToiletRule(),
  isMale: isMaleRule(),
  isFemale: isFemaleRule(),
  isDisabled: isDisabledRule(),
  haveBathroom: haveBathroomRule(),
  rating: ratingRule(),
  toilet_images: toiletImagesRule(),
  toilet_videos: toiletVideosRule(),
  latitude: toiletLatitudeRule(),
  longitude: toiletLongitudeRule(),
});

const adminMultimediaApprovalSchema = Yup.object({
  toilet_images: toiletImagesRule(),
  toilet_videos: toiletVideosRule(),
});

const markerCustomizationSchema = Yup.object({
  preference_marker: preferenceMarkerRule(),
});

export {
  userLoginSchema,
  userRegisterSchema,
  codeVerificationSchema,
  emailSchema,
  resetPasswordSchema,
  personalDetailsSchema,
  changePasswordSchema,
  changeEmailSchema,
  commentSchema,
  addToiletSchema,
  addToiletMultimediaSchema,
  adminToiletVerificationSchema,
  adminMultimediaApprovalSchema,
  markerCustomizationSchema,
};
