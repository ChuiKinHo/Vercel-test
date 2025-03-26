import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import CustomButton from "@components/common/Button/CustomButton";
import useTypeOfToiletMenu from "@components/common/ListGroup/ListGroupMenu/TypeOfToiletMenu";
import { LiaMaleSolid, LiaFemaleSolid, LiaBathSolid } from "react-icons/lia";
import { PiWheelchair } from "react-icons/pi";
import { Formik, Form } from "formik";
import CustomCarousel from "@components/common/Carousel/CustomCarousel";
import Overlay from "@layout/Overlay";
import Modal from "@layout/Modal";
import CustomAvatar from "@components/common/Avatar/Avatar";
import { adminMultimediaApprovalSchema } from "@utils/validationSchema/globalSchema";
import LOCAL_STORAGE_KEYS from "@utils/constants/LocalStorageKeys";
import ToiletImageLightbox from "@components/MultimediaApprovalPage/LightBox/ToiletImageLightbox";
import ToiletVideoLightbox from "@components/MultimediaApprovalPage/LightBox/ToiletVideoLightbox";
import approveNonVerifiedMultimedia from "@services/admin/approveNonVerifiedMultimedia";
import axios from "axios";
import { displaySuccessToast } from "@components/common/Toast/CustomToast";
import { useMutation } from "react-query";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

const EditNonVerifiedMultimediaModal = ({ onCloseModal, rowData, setRows }) => {
  const { t } = useTranslation();
  const TypeOfToiletMenu = useTypeOfToiletMenu();

  const currentLanguage =
    localStorage.getItem(LOCAL_STORAGE_KEYS.LANGUAGE) || "en_us";

  const [toggleUserDetails, setToggleUserDetails] = useState(true);
  const [toggleToiletDetails, setToggleToiletDetails] = useState(true);

  const [openToiletImageLightbox, setOpenToiletImageLightbox] = useState(false);
  const [openToiletVideoLightbox, setOpenToiletVideoLightbox] = useState(false);
  const [selectedToiletImage, setSelectedToiletImage] = useState(null);
  const [selectedToiletVideo, setSelectedToiletVideo] = useState(null);

  const [toiletImages, setToiletImages] = useState([]);
  const [toiletVideos, setToiletVideos] = useState([]);
  const [deletedMultimedia, setDeletedMultimedia] = useState([]);

  const { mutateAsync: ApproveNonVerifiedMultimedia } = useMutation({
    mutationFn: approveNonVerifiedMultimedia,
    onSuccess: (res) => {
      setRows((prevRows) =>
        prevRows.filter(
          (row) => row.id !== `${rowData?.toilet._id}-${rowData?.user._id}`
        )
      );
      onCloseModal();
      displaySuccessToast(
        t("toast.success_messages.non_verifiied_multimedia_approves")
      );
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        displayErrorToast(err.response?.data?.message);
        return;
      }
    },
  });

  const onCarouselClicked = ({ data }) => {
    const selectedMultimedia = rowData?.multimedia.find(
      (multimedia) =>
        multimedia.url === data.url && multimedia.multimedia_type === data.type
    );

    if (data.type === "image") {
      setOpenToiletImageLightbox(true);
      setSelectedToiletImage(selectedMultimedia);
    } else if (data.type === "video") {
      setOpenToiletVideoLightbox(true);
      setSelectedToiletVideo(selectedMultimedia);
    }
  };

  const onDeleteImageOrVideo = (data, { setFieldValue }) => {
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
    if (deletedToiletImageOrVideo) {
      setDeletedMultimedia((prev) => [
        ...prev,
        deletedToiletImageOrVideo.multimediaId,
      ]);
    }
  };

  const handleSubmit = async (data, { setSubmitting }) => {
    setSubmitting(true);
    try {
      await ApproveNonVerifiedMultimedia({
        toiletId: rowData?.toilet._id,
        userId: rowData?.user._id,
        toilet_images: data.toilet_images,
        toilet_videos: data.toilet_videos,
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
        title={t("edit_non_verified_multimedia_modal.title")}
        styles="pb-2 pr-16 -mr-16 my-5"
        onCloseModal={onCloseModal}
      >
        <Formik
          initialValues={{
            toilet_images: [],
            toilet_videos: [],
          }}
          validationSchema={adminMultimediaApprovalSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue }) => {
            useEffect(() => {
              // Check multimedia
              const nonVerifiedImages = rowData?.multimedia
                .filter((multimedia) => multimedia.multimedia_type === "image")
                .map((multimedia) => {
                  const file_type = multimedia.url.match(
                    /^data:([^;]+);base64,/
                  );

                  return {
                    multimediaId: multimedia.multimediaId,
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
                    multimediaId: multimedia.multimediaId,
                    file_type: file_type[1],
                    file_base64: multimedia.url,
                  };
                });

              setToiletImages(nonVerifiedImages);
              setToiletVideos(nonVerifiedVideos);
              setFieldValue("toilet_images", nonVerifiedImages);
              setFieldValue("toilet_videos", nonVerifiedVideos);
            }, []);
            return (
              <Form className="mt-3 w-full bg-transparent px-4">
                <div className="flex flex-col gap-y-8">
                  <div className="flex flex-col gap-y-3">
                    <div className="flex gap-x-5">
                      <p className="text-2xl font-semibold text-text">
                        {t("edit_non_verified_multimedia_modal.user_details")}
                      </p>
                      <CustomButton
                        style="non-verified-multimedia-dropdown-btn"
                        icon={
                          toggleUserDetails ? (
                            <ChevronDownIcon className="size-5 text-text" />
                          ) : (
                            <ChevronRightIcon className="size-5 text-text" />
                          )
                        }
                        onClick={() => setToggleUserDetails((prev) => !prev)}
                      />
                    </div>

                    {toggleUserDetails && (
                      <div className="flex gap-x-5 w-full rounded-lg justify-center items-center shadow-md px-5 py-3">
                        <CustomAvatar
                          src={rowData?.user.userAvatar}
                          alt="User Avatar"
                          varient="size-10"
                        />
                        <p className="tracking-wide text-text/60 text-sm">
                          {rowData?.user.fullname}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-y-3">
                    <div className="flex gap-x-5">
                      <p className="text-2xl font-semibold text-text">
                        {t("edit_non_verified_multimedia_modal.toilet_details")}
                      </p>
                      <CustomButton
                        style="non-verified-multimedia-dropdown-btn"
                        icon={
                          toggleToiletDetails ? (
                            <ChevronDownIcon className="size-5 text-text" />
                          ) : (
                            <ChevronRightIcon className="size-5 text-text" />
                          )
                        }
                        onClick={() => setToggleToiletDetails((prev) => !prev)}
                      />
                    </div>

                    {toggleToiletDetails && (
                      <div className="flex flex-col gap-y-4 items-start w-full">
                        <p className="text-lg font-semibold text-s8">
                          {currentLanguage === "en_us"
                            ? rowData?.toilet?.name_en
                            : rowData?.toilet?.name_zh}
                        </p>

                        <div className="flex flex-col gap-y-3 items-center justify-center w-full bg-s2/50 rounded-lg shadow-md p-3">
                          <div className="flex gap-x-2">
                            <span className="text-text/70">
                              {
                                TypeOfToiletMenu[
                                  rowData?.toilet?.type_of_toilet
                                ].icon
                              }
                            </span>

                            <p className="text-center text-sm font-semibold text-text/70">
                              {
                                TypeOfToiletMenu[
                                  rowData?.toilet?.type_of_toilet
                                ].name
                              }
                            </p>
                          </div>

                          <div className="flex gap-x-2 items-start">
                            {rowData?.toilet?.isMale === "true" && (
                              <LiaMaleSolid className="size-5 text-sky-500" />
                            )}
                            {rowData?.toilet?.isFemale === "true" && (
                              <LiaFemaleSolid className="size-5 text-pink-300" />
                            )}
                            {rowData?.toilet?.isDisabled === "true" && (
                              <PiWheelchair className="size-5 text-sky-500" />
                            )}
                            {rowData?.toilet?.haveBathroom === "true" && (
                              <LiaBathSolid className="size-5 text-sky-500" />
                            )}
                          </div>
                        </div>

                        <div className="mt-2">
                          <div className="flex flex-col gap-y-2">
                            <p className="text-sm text-s5 w-3/4">
                              {currentLanguage === "en_us"
                                ? rowData?.toilet?.address_en
                                : rowData?.toilet?.address_zh}
                            </p>
                            <p className="text-sm text-s5 w-3/4">
                              {currentLanguage === "en_us"
                                ? rowData?.toilet?.area_en
                                : rowData?.toilet?.area_zh}
                            </p>
                            <div className="flex gap-x-3">
                              <p className="text-sm text-s5 w-3/4">
                                {currentLanguage === "en_us"
                                  ? rowData?.toilet?.district_en
                                  : rowData?.toilet?.district_zh}
                              </p>
                              <p className="text-sm text-s5 w-3/4">
                                {currentLanguage === "en_us"
                                  ? rowData?.toilet?.sub_district_en
                                  : rowData?.toilet?.sub_district_zh}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-9 flex items-center justify-center">
                  <CustomCarousel
                    style="add-toilet-drawer-carousel"
                    isDeleteBtn={true}
                    onDelete={(data) =>
                      onDeleteImageOrVideo(data, { setFieldValue })
                    }
                    images={toiletImages.map((image) => image.file_base64)}
                    videos={toiletVideos.map((video) => video.file_base64)}
                    onClick={onCarouselClicked}
                  />
                </div>

                <div className="mt-10">
                  <CustomButton
                    type="submit"
                    disabled={isSubmitting}
                    style="admin-toilet-verification-approve-btn"
                    varient={
                      isSubmitting
                        ? "opacity-30"
                        : "hover:bg-transparent hover:text-text hover:border-dashed"
                    }
                    text={t("common_phases.button.approve")}
                    textStyles="font-semibold"
                    loading={isSubmitting}
                    spinner={true}
                  />
                </div>
              </Form>
            );
          }}
        </Formik>

        {openToiletImageLightbox && selectedToiletImage && (
          <ToiletImageLightbox
            onCloseLightbox={() => setOpenToiletImageLightbox(false)}
            image={selectedToiletImage}
          />
        )}

        {openToiletVideoLightbox && selectedToiletVideo && (
          <ToiletVideoLightbox
            onCloseLightbox={() => setOpenToiletVideoLightbox(false)}
            video={selectedToiletVideo}
          />
        )}
      </Modal>
    </Overlay>
  );
};

export default EditNonVerifiedMultimediaModal;
