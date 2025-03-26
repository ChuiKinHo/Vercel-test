import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import CustomFormInputField from "@components/common/InputFiled/CustomFormInputField";
import CustomButton from "@components/common/Button/CustomButton";
import { addToiletSchema } from "@utils/validationSchema/globalSchema";
import CustomDropdown from "@components/common/Dropdown/CustomDropdown";
import useAreaMenu from "@components/common/Dropdown/DropdownMenu/AreaMenu";
import useDistrictMenu from "@components/common/Dropdown/DropdownMenu/DistrictMenu";
import useSubDistrictMenu from "@components/common/Dropdown/DropdownMenu/SubDistrictMenu";
import TypeOfToiletModal from "../Modals/TypeOfToiletModal";
import CustomToggleButton from "@components/common/ToggleButton/CustomToggleButton";
import { LiaMaleSolid, LiaFemaleSolid, LiaBathSolid } from "react-icons/lia";
import { TbCameraPlus } from "react-icons/tb";
import { PiWheelchair } from "react-icons/pi";
import StarRating from "@components/common/StarRating/CustomStarRating";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import CustomFileUploader from "@components/common/FileUploader/CustomFileUploader";
import { Formik, Form, ErrorMessage } from "formik";
import CustomCarousel from "@components/common/Carousel/CustomCarousel";
import fileSizeFormatter from "@utils/helperFunctions/fileSizeFormatter";
import addToilet from "@services/map/addToilet";
import sortObjectKeys from "@utils/helperFunctions/sortObjectKeys";
import LOCAL_STORAGE_KEYS from "@utils/constants/LocalStorageKeys";
import { TOILET_TOGGLE_STATES } from "@components/common/ToggleButton/ToggleStates";
import { useMutation } from "react-query";
import axios from "axios";
import { displayErrorToast } from "@components/common/Toast/CustomToast";

const acceptMimeTypes = {
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/svg+xml": [".svg"],
  "image/webp": [".webp"],
  "video/mp4": [".mp4"],
  "video/webm": [".webm"],
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_NO_OF_FILES = 10; // Allow only upload upto 10 files

const AddToiletDrawerContent = ({
  userData,
  getToiletDetails,
  setShowAddToiletSuccessDrawer,
  closeAllDrawers,
}) => {
  const { t } = useTranslation();
  const AreaMenu = useAreaMenu();
  const DistrictMenu = useDistrictMenu();
  const SubDistrictMenu = useSubDistrictMenu();
  const currentLanguage =
    localStorage.getItem(LOCAL_STORAGE_KEYS.LANGUAGE) || "en_us";

  const [updatedDistrictMenu, setUpdatedDistrictMenu] = useState(
    sortObjectKeys(DistrictMenu)
  );
  const [updatedSubDistrictMenu, setUpdatedSubDistrictMenu] = useState(
    sortObjectKeys(SubDistrictMenu)
  );

  const [typeOfToilet, setTypeOfToilet] = useState(null);
  const [openTypeOfToiletModal, setOpenTypeOfToiletModal] = useState(false);

  const [isMale, setIsMale] = useState(TOILET_TOGGLE_STATES[0]);
  const [isFemale, setIsFemale] = useState(TOILET_TOGGLE_STATES[0]);
  const [isDisabled, setIsDisabled] = useState(TOILET_TOGGLE_STATES[0]);
  const [haveBathroom, setHaveBathroom] = useState(TOILET_TOGGLE_STATES[0]);
  const [userRating, setUserRating] = useState(0);

  const [advanceAddressEditBtnClicked, setAddvanceAddressEditBtnClicked] =
    useState(false);

  const [toiletImages, setToiletImages] = useState([]);
  const [toiletVideos, setToiletVideos] = useState([]);
  const [loadFileError, setLoadFileError] = useState([]);

  const { mutateAsync: AddToilet } = useMutation({
    mutationFn: addToilet,
    onSuccess: (res) => {
      setShowAddToiletSuccessDrawer(true);
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        displayErrorToast(err.response?.data?.message);
        return;
      }
    },
  });

  const onAreaDropdownSelected = (data, { setFieldValue }) => {
    setFieldValue("area", data.name);
    setFieldValue("district", "");
    setFieldValue("sub_district", "");

    const newDistrictMenu = Object.entries(sortObjectKeys(DistrictMenu))
      .map(([key, item]) => {
        return item.area === data.name ? item : null;
      })
      .filter((item) => item !== null);
    setUpdatedDistrictMenu(newDistrictMenu);

    const newSubDistrictMenu = Object.entries(sortObjectKeys(SubDistrictMenu))
      .map(([key, item]) => {
        return item.area === data.name ? item : null;
      })
      .filter((item) => item !== null);
    setUpdatedSubDistrictMenu(newSubDistrictMenu);
  };

  const onDistrictDropdownSelected = (data, { setFieldValue }) => {
    setFieldValue("district", data.name);
    setFieldValue("area", data.area);
    setFieldValue("sub_district", "");

    const newDistrictMenu = Object.entries(sortObjectKeys(DistrictMenu))
      .map(([key, item]) => {
        return item.area === data.area ? item : null;
      })
      .filter((item) => item !== null);
    setUpdatedDistrictMenu(newDistrictMenu);

    const newSubDistrictMenu = Object.entries(sortObjectKeys(SubDistrictMenu))
      .map(([key, item]) => {
        return item.district === data.name ? item : null;
      })
      .filter((item) => item !== null);
    setUpdatedSubDistrictMenu(newSubDistrictMenu);
  };

  const onSubDistrictDropdownSelected = (data, { setFieldValue }) => {
    setFieldValue("sub_district", data.name);
    setFieldValue("district", data.district);
    setFieldValue("area", data.area);

    const newDistrictMenu = Object.entries(sortObjectKeys(DistrictMenu))
      .map(([key, item]) => {
        return item.area === data.area ? item : null;
      })
      .filter((item) => item !== null);
    setUpdatedDistrictMenu(newDistrictMenu);

    const newSubDistrictMenu = Object.entries(sortObjectKeys(SubDistrictMenu))
      .map(([key, item]) => {
        return item.district === data.district ? item : null;
      })
      .filter((item) => item !== null);
    setUpdatedSubDistrictMenu(newSubDistrictMenu);
  };

  const onMaleToggled = (data, { setFieldValue }) => {
    const nextStateIndex =
      (TOILET_TOGGLE_STATES.indexOf(data) + 1) % TOILET_TOGGLE_STATES.length;
    setIsMale(TOILET_TOGGLE_STATES[nextStateIndex]);
    setFieldValue("isMale", TOILET_TOGGLE_STATES[nextStateIndex]);
  };

  const onFemaleToggled = (data, { setFieldValue }) => {
    const nextStateIndex =
      (TOILET_TOGGLE_STATES.indexOf(data) + 1) % TOILET_TOGGLE_STATES.length;
    setFieldValue("isFemale", TOILET_TOGGLE_STATES[nextStateIndex]);
    setIsFemale(TOILET_TOGGLE_STATES[nextStateIndex]);
  };

  const onDisabledToggled = (data, { setFieldValue }) => {
    const nextStateIndex =
      (TOILET_TOGGLE_STATES.indexOf(data) + 1) % TOILET_TOGGLE_STATES.length;
    setFieldValue("isDisabled", TOILET_TOGGLE_STATES[nextStateIndex]);
    setIsDisabled(TOILET_TOGGLE_STATES[nextStateIndex]);
  };

  const onHaveBathroomToggled = (data, { setFieldValue }) => {
    const nextStateIndex =
      (TOILET_TOGGLE_STATES.indexOf(data) + 1) % TOILET_TOGGLE_STATES.length;
    setFieldValue("haveBathroom", TOILET_TOGGLE_STATES[nextStateIndex]);
    setHaveBathroom(TOILET_TOGGLE_STATES[nextStateIndex]);
  };

  const onRatingChange = (rating, { setFieldValue }) => {
    setFieldValue("rating", rating);
    setUserRating(rating);
  };

  const filePreprocessHandler = async (file, { setFieldValue }) => {
    setLoadFileError("");

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // check if the file size is larger than threshold
      if (file.size > MAX_FILE_SIZE) {
        setLoadFileError(
          `${t(
            "common_phases.form.validations.toilet_files_upload.file_exceed"
          )} ${fileSizeFormatter(MAX_FILE_SIZE)}. ${t(
            "common_phases.form.validations.toilet_files_upload.select_another_images"
          )}`
        );
        return;
      }

      const allUploadedFiles = [...toiletImages, ...toiletVideos];
      const isMaximumFiles = allUploadedFiles.length > MAX_NO_OF_FILES - 1;
      const isDuplicate = allUploadedFiles.some(
        (item) => item.file_base64 === reader.result
      );

      // check if reach max no.of files
      if (isMaximumFiles) {
        setLoadFileError(
          t("common_phases.form.validations.toilet_files_upload.max")
        );
        return;
      }
      // check if dulplicate files appear
      if (isDuplicate) {
        setLoadFileError(
          t("common_phases.form.validations.toilet_files_upload.duplicate")
        );
        return;
      }

      const newFile = {
        file_type: file.type,
        file_base64: reader.result,
      };

      if (file.type.startsWith("image/")) {
        // Handle upload image files
        const updatedToiletImages = [...toiletImages, newFile];
        setFieldValue("toilet_images", updatedToiletImages);
        setToiletImages(updatedToiletImages);
      } else if (file.type.startsWith("video/")) {
        // Handle upload video files
        const updatedToiletVideos = [...toiletVideos, newFile];
        setFieldValue("toilet_videos", updatedToiletVideos);
        setToiletVideos(updatedToiletVideos);
      }
    };
  };

  const onDeleteImageOrVideo = (data, { setFieldValue }) => {
    if (data.type === "image") {
      const updatedToiletImages = toiletImages.filter(
        (image) => data.url !== image.file_base64
      );
      setToiletImages(updatedToiletImages);
      setFieldValue("toilet_images", updatedToiletImages);
    } else {
      const updatedToiletVideos = toiletVideos.filter(
        (video) => data.url !== video.file_base64
      );
      setFieldValue("toilet_videos", updatedToiletVideos);
      setToiletVideos(updatedToiletVideos);
    }
  };

  const handleSubmit = async (data, { setSubmitting }) => {
    setSubmitting(true);
    try {
      await AddToilet(data);
      setSubmitting(false);
    } catch (err) {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full rounded-lg">
      <Formik
        initialValues={{
          address: "",
          area: "",
          district: "",
          sub_district: "",
          type_of_toilet: "",
          isMale: TOILET_TOGGLE_STATES[0],
          isFemale: TOILET_TOGGLE_STATES[0],
          isDisabled: TOILET_TOGGLE_STATES[0],
          haveBathroom: TOILET_TOGGLE_STATES[0],
          rating: 0,
          toilet_images: [],
          toilet_videos: [],
          latitude: null,
          longitude: null,
        }}
        validationSchema={addToiletSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, isSubmitting, touched, setFieldValue, isValid }) => {
          useEffect(() => {
            const toiletDetails = getToiletDetails();

            setFieldValue("address", toiletDetails.address);
            setFieldValue("area", toiletDetails.area);
            setFieldValue("district", toiletDetails.district);
            setFieldValue("sub_district", toiletDetails.sub_district);
            setFieldValue("latitude", toiletDetails.latitude);
            setFieldValue("longitude", toiletDetails.longitude);

            const newDistrictMenu = Object.entries(sortObjectKeys(DistrictMenu))
              .map(([key, item]) => {
                return item.area === toiletDetails.area ? item : null;
              })
              .filter((item) => item !== null);
            setUpdatedDistrictMenu(newDistrictMenu);

            const newSubDistrictMenu = Object.entries(
              sortObjectKeys(SubDistrictMenu)
            )
              .map(([key, item]) => {
                return item.district === toiletDetails.district ? item : null;
              })
              .filter((item) => item !== null);
            setUpdatedSubDistrictMenu(newSubDistrictMenu);
          }, [getToiletDetails]);

          return (
            <Form className="w-full bg-transparent px-4">
              <div>
                <ErrorMessage
                  name="toilet_images"
                  component="div"
                  className="text-red-warning-heavy text-sm font-semibold my-1"
                />
                <ErrorMessage
                  name="toilet_videos"
                  component="div"
                  className="text-red-warning-heavy text-sm font-semibold my-1"
                />
                {loadFileError && (
                  <p className="text-red-warning-heavy text-sm font-semibold my-1">
                    {loadFileError}
                  </p>
                )}
                <CustomFileUploader
                  accept={acceptMimeTypes}
                  filePreprocessHandler={(file) =>
                    filePreprocessHandler(file, { setFieldValue })
                  }
                  maxNoOfFiles={MAX_NO_OF_FILES}
                  dropzoneHeight="h-fit"
                  innerStyle="add-toilet-file-uploader"
                  outerStyle="add-toilet-file-uploader"
                  icon={<TbCameraPlus className="size-7 text-text" />}
                />
              </div>

              {(toiletImages.length > 0 || toiletVideos.length > 0) && (
                <div className="mt-9 flex items-center justify-center">
                  <CustomCarousel
                    style="add-toilet-drawer-carousel"
                    isDeleteBtn={true}
                    onDelete={(data) =>
                      onDeleteImageOrVideo(data, { setFieldValue })
                    }
                    images={toiletImages.map((image) => image.file_base64)}
                    videos={toiletVideos.map((video) => video.file_base64)}
                  />
                </div>
              )}

              <div className="mt-7 flex flex-col gap-y-5">
                {advanceAddressEditBtnClicked && (
                  <>
                    <div className="space-y-3">
                      <label
                        htmlFor="area"
                        className="text-base tracking-wide font-semibold"
                      >
                        {t("common_phases.form.labels.area")}
                      </label>
                      <div className="relative w-1/2">
                        <CustomFormInputField
                          type="text"
                          name="area"
                          id="area"
                          placeholder={t(
                            "common_phases.form.placeholders.enter_area"
                          )}
                          style="add-toilet-area-inputfield"
                          varient={
                            errors.area && touched.area
                              ? "border-red-warning-heavy"
                              : "focus:border-2 focus:border-blue-light"
                          }
                        />
                        <div className="absolute top-1.5 right-2">
                          <CustomDropdown
                            buttonStyle="area-dropdown-btn"
                            buttonIcon={
                              <ChevronDownIcon className="size-5 text-text" />
                            }
                            dropdownMenu={sortObjectKeys(AreaMenu)}
                            menuWidth="w-40"
                            dropdownMenuPosition="right"
                            dropdownMenuVarient="pr-1.5 mt-1"
                            dropdownMenuItemVarient="gap-x-2"
                            dropdownMenuItemStyle="area-dropdown-item"
                            menuGap={0}
                            onMenuItemSelected={(menuItem) =>
                              onAreaDropdownSelected(menuItem, {
                                setFieldValue,
                              })
                            }
                          />
                        </div>
                      </div>
                      <ErrorMessage
                        name="area"
                        component="div"
                        className="text-red-warning-heavy text-sm font-semibold my-1"
                      />
                    </div>

                    <div className="flex flex-row gap-x-6">
                      <div className="space-y-3">
                        <label
                          htmlFor="district"
                          className="text-base tracking-wide font-semibold"
                        >
                          {t("common_phases.form.labels.district")}
                        </label>
                        <div className="relative w-full">
                          <CustomFormInputField
                            type="text"
                            name="district"
                            id="district"
                            placeholder={t(
                              "common_phases.form.placeholders.enter_district"
                            )}
                            style="add-toilet-district-inputfield"
                            varient={
                              errors.district && touched.district
                                ? "border-red-warning-heavy"
                                : "focus:border-2 focus:border-blue-light"
                            }
                          />
                          <div className="absolute top-1.5 right-2">
                            <CustomDropdown
                              buttonStyle="district-dropdown-btn"
                              buttonIcon={
                                <ChevronDownIcon className="size-5 text-text" />
                              }
                              dropdownMenu={updatedDistrictMenu}
                              menuWidth="w-[150px]"
                              dropdownMenuPosition="right"
                              dropdownMenuVarient="pr-1.5 mt-1"
                              dropdownMenuItemVarient="gap-x-2"
                              dropdownMenuItemStyle="district-dropdown-item"
                              menuGap={0}
                              onMenuItemSelected={(menuItem) =>
                                onDistrictDropdownSelected(menuItem, {
                                  setFieldValue,
                                })
                              }
                            />
                          </div>
                        </div>
                        <ErrorMessage
                          name="district"
                          component="div"
                          className="text-red-warning-heavy text-sm font-semibold my-1"
                        />
                      </div>

                      <div className="space-y-3">
                        <label
                          htmlFor="sub_district"
                          className="text-base tracking-wide font-semibold"
                        >
                          {t("common_phases.form.labels.sub_district")}
                        </label>
                        <div className="relative w-full">
                          <CustomFormInputField
                            type="text"
                            name="sub_district"
                            id="sub_district"
                            placeholder={t(
                              "common_phases.form.placeholders.enter_sub_district"
                            )}
                            style="add-toilet-sub-district-inputfield"
                            varient={
                              errors.sub_district && touched.sub_district
                                ? "border-red-warning-heavy"
                                : "focus:border-2 focus:border-blue-light"
                            }
                          />
                          <div className="absolute top-1.5 right-2">
                            <CustomDropdown
                              buttonStyle="sub-district-dropdown-btn"
                              buttonIcon={
                                <ChevronDownIcon className="size-5 text-text" />
                              }
                              dropdownMenu={updatedSubDistrictMenu}
                              menuWidth="w-[150px]"
                              dropdownMenuPosition="right"
                              dropdownMenuVarient="pr-1.5 mt-1"
                              dropdownMenuItemVarient="gap-x-2"
                              dropdownMenuItemStyle="sub-district-dropdown-item"
                              menuGap={0}
                              onMenuItemSelected={(menuItem) =>
                                onSubDistrictDropdownSelected(menuItem, {
                                  setFieldValue,
                                })
                              }
                            />
                          </div>
                        </div>
                        <ErrorMessage
                          name="sub_district"
                          component="div"
                          className="text-red-warning-heavy text-sm font-semibold my-1"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-3">
                  <div className="grid grid-cols-2">
                    <label
                      htmlFor="address"
                      className="text-base tracking-wide font-semibold"
                    >
                      {t("common_phases.form.labels.address")}
                    </label>
                    <div className="justify-self-end">
                      <CustomButton
                        type="button"
                        text={t("common_phases.button.advance_setting")}
                        textStyles="text-sm text-text opacity-40"
                        icon={
                          <AdjustmentsHorizontalIcon className="size-5 text-text opacity-40" />
                        }
                        onClick={() =>
                          setAddvanceAddressEditBtnClicked((prev) => !prev)
                        }
                      />
                    </div>
                  </div>
                  <ErrorMessage
                    name="address"
                    component="div"
                    className="text-red-warning-heavy text-sm font-semibold my-1"
                  />
                  <CustomFormInputField
                    type="textarea"
                    name="address"
                    id="address"
                    placeholder={t(
                      "common_phases.form.placeholders.enter_address"
                    )}
                    style="add-toilet-address-inputfield"
                    varient={
                      errors.address && touched.address
                        ? "border-red-warning-heavy"
                        : "focus:border-2 focus:border-blue-light"
                    }
                  />
                </div>

                <div className="space-y-3">
                  <label
                    htmlFor="type_of_toilet"
                    className="text-base tracking-wide font-semibold"
                  >
                    {t("common_phases.form.labels.rating")}
                  </label>
                  <div className="flex p-5 justify-center items-center shadow-sm rounded-lg bg-s2">
                    <StarRating
                      initialRating={userRating}
                      onRatingChange={(rating) =>
                        onRatingChange(rating, { setFieldValue })
                      }
                    />
                  </div>
                </div>

                {/* Type of Toilet */}
                <div className="space-y-3">
                  <label
                    htmlFor="type_of_toilet"
                    className="text-base tracking-wide font-semibold"
                  >
                    {t("common_phases.form.labels.type_of_toilet")}
                  </label>
                  <ErrorMessage
                    name="type_of_toilet"
                    component="div"
                    className="text-red-warning-heavy text-sm font-semibold my-1"
                  />
                  <div
                    className={`flex justify-center items-center shadow-sm min-h-[110px] rounded-lg ${
                      typeOfToilet
                        ? "bg-blue-100/50 border-2 border-blue-light"
                        : "bg-s2"
                    }`}
                    onClick={() => setOpenTypeOfToiletModal(true)}
                  >
                    {!typeOfToilet && (
                      <p className="text-center text-sm italic text-text opacity-30">
                        {t("common_phases.form.placeholders.click_to_select")}
                      </p>
                    )}
                    {typeOfToilet && (
                      <div className="flex gap-x-2">
                        {typeOfToilet && (
                          <span className="text-text">
                            {typeOfToilet.icon}
                          </span>
                        )}
                        <p className="text-center text-sm font-semibold text-text">
                          {typeOfToilet.name}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Categories */}
                <div className="space-y-3">
                  <label
                    htmlFor="categories"
                    className="text-base tracking-wide font-semibold"
                  >
                    {t("common_phases.form.labels.toilet_categories")}
                  </label>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-4 justify-center">
                    {/* Male */}
                    <div
                      className={`flex flex-col gap-y-6 justify-center items-center shadow-sm min-w-[160px] min-h-[120px] rounded-lg ${
                        isMale === "true"
                          ? "bg-blue-100/50 border-2 border-blue-light"
                          : isMale === "false"
                          ? "bg-red-100/50 border-2 border-red-300"
                          : "bg-s2"
                      }`}
                      onClick={() =>
                        onMaleToggled(isMale, {
                          setFieldValue,
                        })
                      }
                    >
                      <div className="flex gap-x-0.5">
                        <LiaMaleSolid className="size-5 text-s8" />
                        <label
                          htmlFor="male"
                          className="text-sm font-semibold text-s8"
                        >
                          {t("toilet_categories.male")}
                        </label>
                      </div>

                      <CustomToggleButton
                        toggleState={isMale}
                        onToggled={() =>
                          onMaleToggled(isMale, { setFieldValue })
                        }
                      />
                    </div>

                    {/* Female */}
                    <div
                      className={`flex flex-col gap-y-6 justify-center items-center shadow-sm min-w-[160px] min-h-[120px] rounded-lg ${
                        isFemale === "true"
                          ? "bg-blue-100/50 border-2 border-blue-light"
                          : isFemale === "false"
                          ? "bg-red-100/50 border-2 border-red-300"
                          : "bg-s2"
                      }`}
                      onClick={() =>
                        onFemaleToggled(isFemale, { setFieldValue })
                      }
                    >
                      <div className="flex gap-x-0.5">
                        <LiaFemaleSolid className="size-5 text-s8" />
                        <label
                          htmlFor="Female"
                          className="text-sm font-semibold text-s8"
                        >
                          {t("toilet_categories.female")}
                        </label>
                      </div>

                      <CustomToggleButton
                        toggleState={isFemale}
                        onToggled={() =>
                          onFemaleToggled(isFemale, { setFieldValue })
                        }
                      />
                    </div>

                    {/* Disabled */}
                    <div
                      className={`flex flex-col gap-y-6 justify-center items-center shadow-sm min-w-[160px] min-h-[120px] rounded-lg ${
                        isDisabled === "true"
                          ? "bg-blue-100/50 border-2 border-blue-light"
                          : isDisabled === "false"
                          ? "bg-red-100/50 border-2 border-red-300"
                          : "bg-s2"
                      }`}
                      onClick={() =>
                        onDisabledToggled(isDisabled, { setFieldValue })
                      }
                    >
                      <div className="flex gap-x-1.5">
                        <PiWheelchair className="size-5 text-s8" />
                        <label
                          htmlFor="disabled"
                          className="text-sm font-semibold text-s8"
                        >
                          {t("toilet_categories.disabled")}
                        </label>
                      </div>

                      <CustomToggleButton
                        toggleState={isDisabled}
                        onToggled={() =>
                          onDisabledToggled(isDisabled, { setFieldValue })
                        }
                      />
                    </div>

                    {/* Bathroom */}
                    <div
                      className={`flex flex-col gap-y-6 justify-center items-center shadow-sm min-w-[160px] min-h-[120px] rounded-lg ${
                        haveBathroom === "true"
                          ? "bg-blue-100/50 border-2 border-blue-light"
                          : haveBathroom === "false"
                          ? "bg-red-100/50 border-2 border-red-300"
                          : "bg-s2"
                      }`}
                      onClick={() =>
                        onHaveBathroomToggled(haveBathroom, { setFieldValue })
                      }
                    >
                      <div className="flex gap-x-1.5">
                        <LiaBathSolid className="size-5 text-s8" />
                        <label
                          htmlFor="bathroom"
                          className="text-sm font-semibold text-s8"
                        >
                          {t("toilet_categories.bathroom")}
                        </label>
                      </div>

                      <CustomToggleButton
                        toggleState={haveBathroom}
                        onToggled={() =>
                          onHaveBathroomToggled(haveBathroom, {
                            setFieldValue,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              {openTypeOfToiletModal && (
                <TypeOfToiletModal
                  onCloseModal={() => setOpenTypeOfToiletModal(false)}
                  typeOfToilet={typeOfToilet}
                  setTypeOfToilet={setTypeOfToilet}
                  setFieldValue={setFieldValue}
                />
              )}

              <div className="mt-10">
                <CustomButton
                  type="submit"
                  style="add-toilet-submit-btn"
                  varient={
                    isSubmitting || !isValid
                      ? "opacity-30"
                      : "hover:bg-transparent hover:text-black hover:border-dashed"
                  }
                  text={t("common_phases.button.submit")}
                  textStyles="font-semibold"
                  disabled={isSubmitting || !isValid}
                  loading={isSubmitting}
                  spinner={true}
                />
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default AddToiletDrawerContent;
