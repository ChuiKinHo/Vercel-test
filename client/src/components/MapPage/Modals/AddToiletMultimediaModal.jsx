import { useState } from "react";
import Overlay from "@layout/Overlay";
import Modal from "@layout/Modal";
import { useTranslation } from "react-i18next";
import CustomButton from "@components/common/Button/CustomButton";
import CustomFileUploader from "@components/common/FileUploader/CustomFileUploader";
import { Formik, Form, ErrorMessage } from "formik";
import { addToiletMultimediaSchema } from "@utils/validationSchema/globalSchema";
import { TbCameraPlus } from "react-icons/tb";
import CustomCarousel from "@components/common/Carousel/CustomCarousel";
import { useMutation } from "react-query";
import addToiletMultimedia from "@services/map/addToiletMultimedia";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import {
  displaySuccessToast,
  displayErrorToast,
} from "@components/common/Toast/CustomToast";

const acceptMimeTypes = {
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/svg+xml": [".svg"],
  "image/webp": [".webp"],
  "video/mp4": [".mp4"],
  "video/webm": [".webm"],
};

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_NO_OF_FILES = 10;

const DISPLAY_TIME = 5000;

const AddToiletMultimediaModal = ({ selectedToilet, onCloseModal }) => {
  const { t } = useTranslation();

  const [isSubmitted, setIsSubmitted] = useState(false);

  const [toiletImages, setToiletImages] = useState([]);
  const [toiletVideos, setToiletVideos] = useState([]);
  const [loadFileError, setLoadFileError] = useState([]);

  const { mutateAsync: AddToiletMultimedia } = useMutation({
    mutationFn: addToiletMultimedia,
    onSuccess: (res) => {
      displaySuccessToast("Add Image / Videos Successfully");
      setIsSubmitted(true);

      setTimeout(() => {
        setIsSubmitted(false);
        onCloseModal();
      }, DISPLAY_TIME);
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        displayErrorToast(err.response?.data?.message);
        return;
      }
    },
  });

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
    console.log({ ...data, toiletId: selectedToilet?.toiletId });
    try {
      if (selectedToilet) {
        await AddToiletMultimedia({
          ...data,
          toiletId: selectedToilet?.toiletId,
        });
        setSubmitting(false);
      }
    } catch (err) {
      setSubmitting(false);
    }
  };

  return (
    <Overlay>
      <Modal
        title={t("add_toilet_multimedia_modal.title")}
        onCloseModal={onCloseModal}
        styles="pb-2 pr-16 -mr-16 my-5"
      >
        {isSubmitted ? (
          <div className="w-full rounded-lg">
            <div className="flex flex-col gap-y-3 items-center justify-center">
              <CheckCircleIcon className="size-32 text-green-300" />
              <p className="text-lg font-semibold text-center">
                The Images / Videos are pending verification.
              </p>
              <p className="mt-10 text-sm text-s5">
                User will be awarded{" "}
                <span className="font-bold text-base text-url">
                  100 coins
                </span>{" "}
                for after verification
              </p>
              <p className="mt-12 text-sm text-s5">
                Thank you for submission
              </p>
            </div>
          </div>
        ) : (
          <Formik
            initialValues={{
              toilet_images: [],
              toilet_videos: [],
            }}
            validationSchema={addToiletMultimediaSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, setFieldValue, isValid }) => (
              <Form className="flex flex-col gap-y-2">
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
                      images={toiletImages.map((image) => image.file_base64)}
                      videos={toiletVideos.map((video) => video.file_base64)}
                    />
                  </div>
                )}

                <div className="mt-10">
                  <CustomButton
                    type="submit"
                    style="add-toilet-submit-btn"
                    varient={
                      isSubmitting ||
                      !isValid ||
                      (toiletImages.length === 0 && toiletVideos.length === 0)
                        ? "opacity-30"
                        : "hover:bg-transparent hover:text-text hover:border-dashed"
                    }
                    text={t("common_phases.button.submit")}
                    textStyles="font-semibold"
                    disabled={
                      isSubmitting ||
                      !isValid ||
                      (toiletImages.length === 0 && toiletVideos.length === 0)
                    }
                    loading={isSubmitting}
                    spinner={true}
                  />
                </div>
              </Form>
            )}
          </Formik>
        )}
      </Modal>
    </Overlay>
  );
};

export default AddToiletMultimediaModal;
