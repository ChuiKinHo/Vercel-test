import * as Yup from "yup";
import { i18n } from "src/contexts/LanguageProvider";

const emailRule = () =>
  Yup.string()
    .required(i18n.t("common_phases.form.validations.email.required"))
    .email(i18n.t("common_phases.form.validations.email.invalid_format"))
    .trim();

const passwordRule = () =>
  Yup.string()
    .required(i18n.t("common_phases.form.validations.password.required"))
    .min(8, i18n.t("common_phases.form.validations.password.min_required"))
    .trim();

const confirmedPasswordRule = () =>
  Yup.string()
    .required(
      i18n.t("common_phases.form.validations.confirmed_password.required")
    )
    .oneOf(
      [Yup.ref("password"), null],
      i18n.t("common_phases.form.validations.confirmed_password.not_match")
    )
    .trim();

const newConfirmedPasswordRule = () =>
  Yup.string()
    .required(
      i18n.t("common_phases.form.validations.new_confirmed_password.required")
    )
    .oneOf(
      [Yup.ref("newPassword"), null],
      i18n.t("common_phases.form.validations.new_confirmed_password.not_match")
    )
    .trim();

const codeVerificationRule = () =>
  Yup.array()
    .of(Yup.string().required().matches(/^\d$/))
    .length(
      6,
      i18n.t("common_phases.form.validations.code_verification.invalid_format")
    );

const fullnameRule = () =>
  Yup.string()
    .required(i18n.t("common_phases.form.validations.fullname.required"))
    .max(23, i18n.t("common_phases.form.validations.fullname.max_required"))
    .trim();

const usernameRule = () =>
  Yup.string()
    .required(i18n.t("common_phases.form.validations.username.required"))
    .max(23, i18n.t("common_phases.form.validations.username.max_required"))
    .trim();

const phoneRule = () =>
  Yup.string()
    .test(
      "is_valid_format",
      i18n.t("common_phases.form.validations.phone.invalid_format"),
      (value) => {
        if (!value) return true;

        const isValidFormat = /^\d+$/.test(value);
        return isValidFormat;
      }
    )
    .test(
      "is_valid_min_required",
      i18n.t("common_phases.form.validations.phone.invalid_phone_number"),
      (value) => {
        if (!value) return true;

        const isValidLength = value.length >= 7 && value.length <= 13;
        return isValidLength;
      }
    )
    .trim();

const locationRule = () => Yup.string().trim();

const telCountryCodeRule = () => Yup.string().trim();

const commentRule = () =>
  Yup.string()
    .required(i18n.t("common_phases.form.validations.comment.required"))
    .trim();

const toiletAddressRule = () =>
  Yup.string()
    .trim()
    .required(i18n.t("common_phases.form.validations.toilet_address.required"));

const toiletAddressNotRequiredRule = () => Yup.string().trim();

const toiletAreaRule = () => Yup.string().trim().nullable();

const toiletDistrictRule = () => Yup.string().trim().nullable();

const toiletSubDistrictRule = () => Yup.string().trim().nullable();

const typeOfToiletRule = () =>
  Yup.string()
    .oneOf(
      ["public", "private", "shopping_plaza", "restaurant"],
      i18n.t("common_phases.form.validations.type_of_toilet.invalid_format")
    )
    .required(i18n.t("common_phases.form.validations.type_of_toilet.required"));

const isMaleRule = () => Yup.mixed().oneOf(["not_sure", "true", "false"]);

const isFemaleRule = () => Yup.mixed().oneOf(["not_sure", "true", "false"]);

const isDisabledRule = () => Yup.mixed().oneOf(["not_sure", "true", "false"]);

const haveBathroomRule = () => Yup.mixed().oneOf(["not_sure", "true", "false"]);

const ratingRule = () => Yup.number();

const toiletImagesRule = () =>
  Yup.array().of(
    Yup.object().shape({
      file_type: Yup.string().matches(
        /image\/(jpeg|png|svg\+xml|webp)/,
        i18n.t("common_phases.form.validations.toilet_images.invalid_format")
      ),
      toilet_image_base64: Yup.string(),
    })
  );

const toiletVideosRule = () =>
  Yup.array().of(
    Yup.object().shape({
      file_type: Yup.string().matches(
        /video\/(mp4|webm|)/,
        i18n.t("common_phases.form.validations.toilet_videos.invalid_format")
      ),
      toilet_image_base64: Yup.string(),
    })
  );

const toiletLatitudeRule = () =>
  Yup.number()
    .required(i18n.t("common_phases.form.validations.latitude.required"))
    .min(-90, i18n.t("common_phases.form.validations.latitude.invalid"))
    .max(90, i18n.t("common_phases.form.validations.latitude.invalid"));

const toiletLongitudeRule = () =>
  Yup.number()
    .required(i18n.t("common_phases.form.validations.longitude.required"))
    .min(-180, i18n.t("common_phases.form.validations.longitude.invalid"))
    .max(180, i18n.t("common_phases.form.validations.longitude.invalid"));

const toiletNameRule = () =>
  Yup.string().required(
    i18n.t("common_phases.form.validations.toilet_name.required")
  );

const preferenceMarkerRule = () => Yup.string().trim();

export {
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
};
