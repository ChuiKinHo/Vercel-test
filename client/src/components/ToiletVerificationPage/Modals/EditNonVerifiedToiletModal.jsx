import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import CustomFormInputField from "@components/common/InputFiled/CustomFormInputField";
import CustomButton from "@components/common/Button/CustomButton";
import { adminToiletVerificationSchema } from "@utils/validationSchema/globalSchema";
import CustomDropdown from "@components/common/Dropdown/CustomDropdown";
import useAreaMenu from "@components/common/Dropdown/DropdownMenu/AreaMenu";
import useDistrictMenu from "@components/common/Dropdown/DropdownMenu/DistrictMenu";
import useSubDistrictMenu from "@components/common/Dropdown/DropdownMenu/SubDistrictMenu";
import useTypeOfToiletMenu from "@components/common/ListGroup/ListGroupMenu/TypeOfToiletMenu";
import TypeOfToiletModal from "@components/MapPage/Modals/TypeOfToiletModal";
import CustomToggleButton from "@components/common/ToggleButton/CustomToggleButton";
import { LiaMaleSolid, LiaFemaleSolid, LiaBathSolid } from "react-icons/lia";
import { TbCameraPlus } from "react-icons/tb";
import { PiWheelchair } from "react-icons/pi";
import StarRating from "@components/common/StarRating/CustomStarRating";
import {
  AdjustmentsHorizontalIcon,
  ChevronRightIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import CustomFileUploader from "@components/common/FileUploader/CustomFileUploader";
import { Formik, Form, ErrorMessage } from "formik";
import CustomCarousel from "@components/common/Carousel/CustomCarousel";
import fileSizeFormatter from "@utils/helperFunctions/fileSizeFormatter";
import Overlay from "@layout/Overlay";
import Modal from "@layout/Modal";
import CustomAvatar from "@components/common/Avatar/Avatar";
import sortObjectKeys from "@utils/helperFunctions/sortObjectKeys";
import getAddress from "@services/map/getAddress";
import Env from "@utils/constants/Env";
import { translateByValue } from "@utils/helperFunctions/getTranslation";
import LOCAL_STORAGE_KEYS from "@utils/constants/LocalStorageKeys";
import approveNonVerifiedToilet from "@services/admin/approveNonVerifiedToilet";
import axios from "axios";
import { displaySuccessToast } from "@components/common/Toast/CustomToast";
import { useMutation } from "react-query";
import { TOILET_TOGGLE_STATES } from "@components/common/ToggleButton/ToggleStates";

const acceptMimeTypes = {
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/svg+xml": [".svg"],
  "image/webp": [".webp"],
  "video/mp4": [".mp4"],
  "video/webm": [".webm"],
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_NO_OF_FILES = 10;

const EditNonVerifiedToiletModal = ({ onCloseModal, rowData, setRows }) => {
  const { t } = useTranslation();
  const AreaMenu = useAreaMenu();
  const SubDistrictMenu = useSubDistrictMenu();
  const DistrictMenu = useDistrictMenu();
  const TypeOfToiletMenu = useTypeOfToiletMenu();

  const currentLanguage =
    localStorage.getItem(LOCAL_STORAGE_KEYS.LANGUAGE) || "en_us";

  const { mutateAsync: ApproveNonVerifiedToilet } = useMutation({
    mutationFn: approveNonVerifiedToilet,
    onSuccess: (res) => {
      setRows((prevRows) =>
        prevRows.filter((row) => row.id !== rowData?.toiletId)
      );
      onCloseModal();
      displaySuccessToast(
        t("toast.success_messages.non_verifiied_toilet_approves")
      );
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        displayErrorToast(err.response?.data?.message);
        return;
      }
    },
  });

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
  const [deletedMultimedia, setDeletedMultimedia] = useState([]);
  const [loadFileError, setLoadFileError] = useState([]);

  const [isNextPage, setisNextPage] = useState(false);
  const [isAutoFilling, setIsAutoFilling] = useState(false);

  useEffect(() => {
    console.log(rowData);

    setUserRating(rowData?.rating[0].value);
    setTypeOfToilet({
      name: TypeOfToiletMenu[rowData?.type_of_toilet].name,
      value: rowData?.type_of_toilet,
      icon: TypeOfToiletMenu[rowData?.type_of_toilet].icon,
    });
    setIsMale(rowData?.isMale);
    setIsFemale(rowData?.isFemale);
    setIsDisabled(rowData?.isDisabled);
    setHaveBathroom(rowData?.haveBathroom);

    // Reset Dropdown
    const newDistrictMenu = Object.entries(sortObjectKeys(DistrictMenu))
      .map(([key, item]) => {
        return item.area === rowData?.area_en || item.area === rowData?.area_zh
          ? item
          : null;
      })
      .filter((item) => item !== null);
    setUpdatedDistrictMenu(newDistrictMenu);

    const newSubDistrictMenu = Object.entries(sortObjectKeys(SubDistrictMenu))
      .map(([key, item]) => {
        return item.district === rowData?.district_en ||
          item.district === rowData?.district_zh
          ? item
          : null;
      })
      .filter((item) => item !== null);
    setUpdatedSubDistrictMenu(newSubDistrictMenu);
  }, []);

  const onAreaDropdownSelected = (data, { setFieldValue }) => {
    setFieldValue("area", data.name);
    setFieldValue("district", "");
    setFieldValue("sub_district", "");

    setFieldValue(
      "area_en",
      currentLanguage === "en_us"
        ? data.name
        : translateByValue("zh_tw", "en_us", data.name)
    );
    setFieldValue("district_en", "");
    setFieldValue("sub_district_en", "");
    setFieldValue(
      "area_en",
      currentLanguage === "zh_tw"
        ? data.name
        : translateByValue("en_us", "zh_tw", data.name)
    );
    setFieldValue("district_zh", "");
    setFieldValue("sub_district_zh", "");

    // Reset Dropdown
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

    setFieldValue(
      "area_en",
      currentLanguage === "en_us"
        ? data.area
        : translateByValue("zh_tw", "en_us", data.area)
    );
    setFieldValue(
      "district_en",
      currentLanguage === "en_us"
        ? data.name
        : translateByValue("zh_tw", "en_us", data.name)
    );
    setFieldValue("sub_district_en", "");
    setFieldValue(
      "area_en",
      currentLanguage === "zh_tw"
        ? data.area
        : translateByValue("en_us", "zh_tw", data.area)
    );
    setFieldValue(
      "district_zh",
      currentLanguage === "zh_tw"
        ? data.name
        : translateByValue("en_us", "zh_tw", data.name)
    );
    setFieldValue("sub_district_zh", "");

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

    setFieldValue(
      "area_en",
      currentLanguage === "en_us"
        ? data.area
        : translateByValue("zh_tw", "en_us", data.area)
    );
    setFieldValue(
      "district_en",
      currentLanguage === "en_us"
        ? data.district
        : translateByValue("zh_tw", "en_us", data.district)
    );
    setFieldValue(
      "sub_district_en",
      currentLanguage === "en_us"
        ? data.name
        : translateByValue("zh_tw", "en_us", data.name)
    );
    setFieldValue(
      "area_en",
      currentLanguage === "zh_tw"
        ? data.area
        : translateByValue("en_us", "zh_tw", data.area)
    );
    setFieldValue(
      "district_zh",
      currentLanguage === "zh_tw"
        ? data.district
        : translateByValue("en_us", "zh_tw", data.district)
    );
    setFieldValue(
      "sub_district_zh",
      currentLanguage === "zh_tw"
        ? data.name
        : translateByValue("en_us", "zh_tw", data.name)
    );

    // Reset Dropdown
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
    console.log(data);
    if (data.type === "image") {
      const updatedToiletImages = toiletImages.filter(
        (image) => image.file_base64 !== data.url
      );
      setToiletImages(updatedToiletImages);
      setFieldValue("toilet_images", updatedToiletImages);
    } else {
      const updatedToiletVideos = toiletVideos.filter(
        (video) => video.file_base64 !== data.url
      );
      setFieldValue("toilet_videos", updatedToiletVideos);
      setToiletVideos(updatedToiletVideos);
    }

    // Store the deleted image / video
    const deletedToiletImageOrVideo = rowData?.multimedia.find(
      (multimedia) => multimedia.url === data.url
    );
    if (deletedToiletImageOrVideo?._id) {
      setDeletedMultimedia((prev) => [...prev, deletedToiletImageOrVideo._id]);
    }
  };

  const autoFillInData = async ({ setFieldValue }) => {
    setIsAutoFilling(true);
    const data_en = await getAddress({
      latitude: rowData?.location.coordinates[1],
      longitude: rowData?.location.coordinates[0],
      GOOGLE_API_KEY: Env.GOOGLE_API_KEY,
      language: "en_us",
    });
    const data_zh = await getAddress({
      latitude: rowData?.location.coordinates[1],
      longitude: rowData?.location.coordinates[0],
      GOOGLE_API_KEY: Env.GOOGLE_API_KEY,
      language: "zh_tw",
    });

    setFieldValue(
      "address",
      currentLanguage === "en_us" ? data_en.address : data_zh.address
    );
    setFieldValue(
      "area",
      currentLanguage === "en_us" ? data_en.area : data_zh.area
    );
    setFieldValue("district", SubDistrictMenu[data_en.sub_district]?.district);
    setFieldValue(
      "sub_district",
      currentLanguage === "en_us" ? data_en.sub_district : data_zh.sub_district
    );

    setFieldValue("address_en", data_en.address);
    setFieldValue("area_en", data_en.area);
    setFieldValue(
      "district_en",
      currentLanguage === "en_us"
        ? SubDistrictMenu[data_en.sub_district]?.district
        : translateByValue(
            "zh_tw",
            "en_us",
            SubDistrictMenu[data_en.sub_district]?.district
          )
    );
    setFieldValue("sub_district_en", data_en.sub_district);

    setFieldValue("address_zh", data_zh.address);
    setFieldValue("area_zh", data_zh.area);
    setFieldValue(
      "district_zh",
      currentLanguage === "zh_tw"
        ? SubDistrictMenu[data_en.sub_district]?.district
        : translateByValue(
            "en_us",
            "zh_tw",
            SubDistrictMenu[data_en.sub_district]?.district
          )
    );
    setFieldValue("sub_district_zh", data_zh.sub_district);

    setFieldValue(
      "name_en",
      `Toilet ( ${data_en.area}, ${
        currentLanguage === "en_us"
          ? SubDistrictMenu[data_en.sub_district]?.district
          : translateByValue(
              "zh_tw",
              "en_us",
              SubDistrictMenu[data_en.sub_district]?.district
            )
      }, ${data_en.sub_district} )`
    );
    setFieldValue(
      "name_zh",
      `厠所 ( ${data_zh.area}, ${
        currentLanguage === "zh_tw"
          ? SubDistrictMenu[data_en.sub_district]?.district
          : translateByValue(
              "en_us",
              "zh_tw",
              SubDistrictMenu[data_en.sub_district]?.district
            )
      }, ${data_zh.sub_district} )`
    );

    // Reset Dropdown
    const newDistrictMenu = Object.entries(sortObjectKeys(DistrictMenu))
      .map(([key, item]) => {
        return item.area === data_en.area || item.area === data_zh.area
          ? item
          : null;
      })
      .filter((item) => item !== null);
    setUpdatedDistrictMenu(newDistrictMenu);

    const newSubDistrictMenu = Object.entries(sortObjectKeys(SubDistrictMenu))
      .map(([key, item]) => {
        return item.district === SubDistrictMenu[data_en.sub_district]?.district
          ? item
          : null;
      })
      .filter((item) => item !== null);
    setUpdatedSubDistrictMenu(newSubDistrictMenu);

    setIsAutoFilling(false);
  };

  const handleSubmit = async (data, { setSubmitting }) => {
    setSubmitting(true);
    try {
      await ApproveNonVerifiedToilet({
        toiletId: rowData?.toiletId,
        userId: rowData?.user._id,
        address_en:
          data.address && currentLanguage === "en_us"
            ? data.address
            : data.address_en,
        area_en:
          data.area && currentLanguage === "en_us" ? data.area : data.area_en,
        district_en:
          data.district && currentLanguage === "en_us"
            ? data.district
            : data.district_en,
        sub_district_en:
          data.sub_district && currentLanguage === "en_us"
            ? data.sub_district
            : data.sub_district_en,
        address_zh:
          data.address && currentLanguage === "zh_tw"
            ? data.address
            : data.address_zh,
        area_zh:
          data.area && currentLanguage === "zh_tw" ? data.area : data.area_zh,
        district_zh:
          data.district && currentLanguage === "zh_tw"
            ? data.district
            : data.district_zh,
        sub_district_zh:
          data.sub_district && currentLanguage === "zh_tw"
            ? data.sub_district
            : data.sub_district_zh,
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
        deletedMultimedia: deletedMultimedia,
      });
      setSubmitting(false);
    } catch (err) {
      setSubmitting(false);
    }
  };

  return (
    <Overlay>
      <Modal
        title={t("edit_non_verified_toilet_modal.title")}
        styles="pb-2 pr-16 -mr-16 my-5"
        isReturnButtonEnabled={isNextPage}
        onReturn={() => setisNextPage(false)}
        onCloseModal={onCloseModal}
      >
        <Formik
          initialValues={{
            address_en: rowData?.address_en,
            area_en: rowData?.area_en,
            district_en: rowData?.district_en,
            sub_district_en: rowData?.sub_district_en,
            address_zh: rowData?.address_zh,
            area_zh: rowData?.area_zh,
            district_zh: rowData?.district_zh,
            sub_district_zh: rowData?.sub_district_zh,
            name_en: "",
            name_zh: "",
            area: rowData?.area_en ? rowData?.area_en : rowData?.area_zh,
            address: rowData?.address_en
              ? rowData?.address_en
              : rowData?.address_zh,
            district: rowData?.district_en
              ? rowData?.district_en
              : rowData?.district_zh,
            sub_district: rowData?.sub_district_en
              ? rowData?.sub_district_en
              : rowData?.sub_district_zh,
            type_of_toilet: rowData?.type_of_toilet,
            isMale: rowData?.isMale,
            isFemale: rowData?.isFemale,
            isDisabled: rowData?.isDisabled,
            haveBathroom: rowData?.haveBathroom,
            rating: rowData?.rating[0].value,
            toilet_images: [],
            toilet_videos: [],
            latitude: rowData?.location.coordinates[1],
            longitude: rowData?.location.coordinates[0],
          }}
          validationSchema={adminToiletVerificationSchema}
          onSubmit={handleSubmit}
        >
          {({
            errors,
            isSubmitting,
            touched,
            setFieldValue,
            isValid,
            validateForm,
            setTouched,
          }) => {
            useEffect(() => {
              // Check multimedia
              const nonVerifiedImages = rowData?.multimedia
                .filter((multimedia) => multimedia.multimedia_type === "image")
                .map((multimedia) => {
                  const file_type = multimedia.url.match(
                    /^data:([^;]+);base64,/
                  );

                  return {
                    file_type: file_type[1],
                    file_base64: multimedia.url,
                  };
                });

              const nonVerifiedVideos = rowData?.multimedia
                .filter((multimedia) => multimedia.multimedia_type === "video")
                .map((multimedia) => {
                  const file_type = multimedia.url.match(
                    /^data:([^;]+);base64,/
                  );
                  return {
                    file_type: file_type[1],
                    file_base64: multimedia.url,
                  };
                });

              setToiletImages(nonVerifiedImages);
              setToiletVideos(nonVerifiedVideos);
              setFieldValue("toilet_images", nonVerifiedImages);
              setFieldValue("toilet_videos", nonVerifiedVideos);

              if (!rowData?.area_en) {
                setFieldValue(
                  "area_en",
                  translateByValue("zh_tw", "en_us", rowData?.area_zh)
                );
              } else {
                setFieldValue(
                  "area_zh",
                  translateByValue("en_us", "zh_tw", rowData?.area_en)
                );
              }

              if (!rowData?.district_en) {
                setFieldValue(
                  "district_en",
                  translateByValue("zh_tw", "en_us", rowData?.district_zh)
                );
              } else {
                setFieldValue(
                  "district_zh",
                  translateByValue("en_us", "zh_tw", rowData?.district_en)
                );
              }

              if (!rowData?.sub_district_en) {
                setFieldValue(
                  "sub_district_en",
                  translateByValue("zh_tw", "en_us", rowData?.sub_district_zh)
                );
              } else {
                setFieldValue(
                  "sub_district_zh",
                  translateByValue("en_us", "zh_tw", rowData?.sub_district_en)
                );
              }
            }, []);
            return (
              <Form className="w-full bg-transparent px-4">
                {isNextPage && (
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

                    {(toiletImages.length > 0 || toiletVideos.length > 0) && (
                      <div className="mt-9 flex items-center justify-center">
                        <CustomCarousel
                          style="add-toilet-drawer-carousel"
                          isDeleteBtn={true}
                          onDelete={(data) =>
                            onDeleteImageOrVideo(data, { setFieldValue })
                          }
                          images={toiletImages.map(
                            (image) => image.file_base64
                          )}
                          videos={toiletVideos.map(
                            (video) => video.file_base64
                          )}
                        />
                      </div>
                    )}

                    <div className="mt-10">
                      <CustomButton
                        type="submit"
                        disabled={isSubmitting || !isValid}
                        style="admin-toilet-verification-approve-btn"
                        varient={
                          isSubmitting || !isValid
                            ? "opacity-30"
                            : "hover:bg-transparent hover:text-text hover:border-dashed"
                        }
                        text={t("common_phases.button.approve")}
                        textStyles="font-semibold"
                        loading={isSubmitting}
                        spinner={true}
                      />
                    </div>
                  </div>
                )}

                {!isNextPage && (
                  <div className="mt-7 flex flex-col gap-y-5">
                    <div className="grid grid-cols-2">
                      <div className="justify-self-start w-full">
                        <div className="flex flex-col gap-y-3 md:flex-row md:gap-x-5 rounded-lg shadow-md justify-center items-center p-3">
                          <CustomAvatar
                            src={rowData?.user.userAvatar}
                            alt="User Avatar"
                            varient="size-10"
                          />
                          <p className="tracking-wide text-text/60 text-sm">
                            {rowData?.user.fullname}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-y-5 justify-self-end">
                        <CustomButton
                          type="button"
                          text={t("common_phases.button.auto_fill_in")}
                          textStyles="text-sm text-text/60"
                          loading={isAutoFilling}
                          spinner={true}
                          icon={
                            isAutoFilling ? (
                              ""
                            ) : (
                              <PencilSquareIcon className="size-5 text-text/60" />
                            )
                          }
                          onClick={async () => {
                            await autoFillInData({
                              setFieldValue,
                            });
                            // Validate the form
                            const errors = await validateForm();
                            if (Object.keys(errors).length > 0) {
                              setTouched({
                                name_en: true,
                                name_zh: true,
                                address: true,
                                area: true,
                                district: true,
                                sub_district: true,
                                type_of_toilet: true,
                                latitude: true,
                                longitude: true,
                              });
                              setisNextPage(false);
                            } else {
                              setisNextPage(true);
                            }
                          }}
                        />
                        <CustomButton
                          type="button"
                          text={t("common_phases.button.advance_setting")}
                          textStyles="text-sm text-text/60"
                          icon={
                            <AdjustmentsHorizontalIcon className="size-5 text-text/60" />
                          }
                          onClick={() =>
                            setAddvanceAddressEditBtnClicked((prev) => !prev)
                          }
                        />
                      </div>
                    </div>

                    <div className="mt-5 space-y-3">
                      <label
                        htmlFor="name_en"
                        className="text-base tracking-wide font-semibold"
                      >
                        {t("common_phases.form.labels.name_en")}
                      </label>
                      <ErrorMessage
                        name="name_en"
                        component="div"
                        className="text-red-warning-heavy text-sm font-semibold my-1"
                      />
                      <CustomFormInputField
                        type="text"
                        name="name_en"
                        id="name_en"
                        placeholder={t(
                          "common_phases.form.placeholders.enter_name_en"
                        )}
                        style="add-toilet-address-inputfield"
                        varient={
                          errors.name_en && touched.name_en
                            ? "border-red-warning-heavy"
                            : "focus:border-2 focus:border-blue-light"
                        }
                      />
                    </div>

                    <div className="space-y-3">
                      <label
                        htmlFor="name_zh"
                        className="text-base tracking-wide font-semibold"
                      >
                        {t("common_phases.form.labels.name_zh")}
                      </label>
                      <ErrorMessage
                        name="name_zh"
                        component="div"
                        className="text-red-warning-heavy text-sm font-semibold my-1"
                      />
                      <CustomFormInputField
                        type="text"
                        name="name_zh"
                        id="name_zh"
                        placeholder={t(
                          "common_phases.form.placeholders.enter_name_zh"
                        )}
                        style="add-toilet-address-inputfield"
                        varient={
                          errors.name_zh && touched.name_zh
                            ? "border-red-warning-heavy"
                            : "focus:border-2 focus:border-blue-light"
                        }
                      />
                    </div>

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
                                  dropdownMenu={sortObjectKeys(
                                    updatedDistrictMenu
                                  )}
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
                                  dropdownMenu={sortObjectKeys(
                                    updatedSubDistrictMenu
                                  )}
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

                        {/* Latitude and Longitude */}
                        <div className="flex flex-row gap-x-6">
                          <div className="space-y-3">
                            <label
                              htmlFor="latitude"
                              className="text-base tracking-wide font-semibold"
                            >
                              {t("common_phases.form.labels.latitude")}
                            </label>
                            <ErrorMessage
                              name="latitude"
                              component="div"
                              className="text-red-warning-heavy text-sm font-semibold my-1"
                            />
                            <div className="w-full">
                              <CustomFormInputField
                                type="text"
                                name="latitude"
                                id="latitude"
                                placeholder={t(
                                  "common_phases.form.placeholders.enter_latitude"
                                )}
                                style="add-toilet-district-inputfield"
                                varient={
                                  errors.latitude && touched.latitude
                                    ? "border-red-warning-heavy"
                                    : "focus:border-2 focus:border-blue-light"
                                }
                              />
                            </div>
                          </div>

                          <div className="space-y-3">
                            <label
                              htmlFor="longitude"
                              className="text-base tracking-wide font-semibold"
                            >
                              {t("common_phases.form.labels.longitude")}
                            </label>
                            <ErrorMessage
                              name="longitude"
                              component="div"
                              className="text-red-warning-heavy text-sm font-semibold my-1"
                            />
                            <div className="w-full">
                              <CustomFormInputField
                                type="text"
                                name="longitude"
                                id="longitude"
                                placeholder={t(
                                  "common_phases.form.placeholders.enter_longitude"
                                )}
                                style="add-toilet-sub-district-inputfield"
                                varient={
                                  errors.longitude && touched.longitude
                                    ? "border-red-warning-heavy"
                                    : "focus:border-2 focus:border-blue-light"
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    <div className="space-y-3">
                      <label
                        htmlFor="address"
                        className="text-base tracking-wide font-semibold"
                      >
                        {t("common_phases.form.labels.address")}
                      </label>
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
                      <div className="flex p-5 justify-center items-center shadow-sm rounded-lg bg-s2/20">
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
                            : "bg-s2/20"
                        }`}
                        onClick={() => setOpenTypeOfToiletModal(true)}
                      >
                        {!typeOfToilet && (
                          <p className="text-center text-sm italic text-text/30">
                            {t(
                              "common_phases.form.placeholders.click_to_select"
                            )}
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
                            onHaveBathroomToggled(haveBathroom, {
                              setFieldValue,
                            })
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

                    <div className="mt-10">
                      <CustomButton
                        type="button"
                        style="admin-toilet-verification-next-page-btn"
                        varient={
                          isSubmitting || !isValid
                            ? "opacity-30"
                            : "hover:bg-transparent hover:text-text hover:border-dashed"
                        }
                        text={t("common_phases.button.next")}
                        textStyles="font-semibold"
                        icon={<ChevronRightIcon className="size-5" />}
                        disabled={!isValid}
                        onClick={async () => {
                          const errors = await validateForm();
                          if (Object.keys(errors).length > 0) {
                            setTouched({
                              name_en: true,
                              name_zh: true,
                              address: true,
                              area: true,
                              district: true,
                              sub_district: true,
                              type_of_toilet: true,
                              latitude: true,
                              longitude: true,
                            });
                            setisNextPage(false);
                          } else {
                            setisNextPage(true);
                          }
                        }}
                      />
                    </div>
                  </div>
                )}

                {openTypeOfToiletModal && (
                  <TypeOfToiletModal
                    onCloseModal={() => setOpenTypeOfToiletModal(false)}
                    typeOfToilet={typeOfToilet}
                    setTypeOfToilet={setTypeOfToilet}
                    setFieldValue={setFieldValue}
                  />
                )}
              </Form>
            );
          }}
        </Formik>
      </Modal>
    </Overlay>
  );
};

export default EditNonVerifiedToiletModal;
