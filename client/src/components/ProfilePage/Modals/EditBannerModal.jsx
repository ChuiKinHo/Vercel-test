import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import QUERY_KEYS from "@utils/constants/QueryKeys";
import editUserBanner from "@services/users/editUserBanner";
import Overlay from "@layout/Overlay";
import Modal from "@layout/Modal";
import fileSizeFormatter from "@utils/helperFunctions/fileSizeFormatter";
import getImageDimension from "@utils/helperFunctions/getImageDimension";
import CustomFileUploader from "@components/common/FileUploader/CustomFileUploader";
import CustomButton from "@components/common/Button/CustomButton";
import { useTranslation } from "react-i18next";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import {
  displayErrorToast,
  displaySuccessToast,
} from "@components/common/Toast/CustomToast";

const acceptMimeTypes = {
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/svg+xml": [".svg"],
  "image/webp": [".webp"],
};

const minBannerDimension = {
  width: 600,
  height: 800,
};

const previewBannerDimension = {
  width: 544,
  height: 789,
};

const maxFileSize = 10 * 1024 * 1024; // 10 MB

const EditBannerModal = ({ onCloseModal }) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(null);
  const [fileMimeType, setFileMimeType] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [loadImageError, setLoadImageError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutateAsync: EditUserBanner } = useMutation({
    mutationFn: editUserBanner,
    onSuccess: (res) => {
      queryClient.setQueryData([QUERY_KEYS.USER_DATA], res);
      onCloseModal();
      // displaySuccessToast(res.message);
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        displayErrorToast(err.response?.data?.message);
        return;
      }
    },
  });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await EditUserBanner({ upload: imageBase64, fileMimeType });
      setIsSubmitting(false);
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  const filePreprocessHandler = async (file) => {
    setLoadImageError("");
    const imageDimension = await getImageDimension(file);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (file.size > maxFileSize) {
        setLoadImageError(
          `${t("edit_banner_modal.image_exceed")} ${fileSizeFormatter(
            maxFileSize
          )}. ${t("edit_banner_modal.select_another_images")}`
        );
      } else if (
        imageDimension.naturalWidth < minBannerDimension.width ||
        imageDimension.naturalHeight < minBannerDimension.height
      ) {
        setLoadImageError(
          `${t(
            "edit_banner_modal.image_at_least"
          )} ${minBannerDimension.width} x ${minBannerDimension.height}`
        );
      }
      setImageBase64(reader.result);
      setFileName(file.name);
      setFileMimeType(file.type);
      setFileSize(fileSizeFormatter(file.size));
    };
  };

  const onReturnButtonClick = () => {
    setFileName("");
    setFileMimeType("");
    setImageBase64("");
    setFileSize(null);
  };

  return (
    <Overlay>
      <Modal
        title={t("edit_banner_modal.title")}
        styles="pb-2 pr-16 -mr-16 my-5"
        isReturnButtonEnabled={imageBase64}
        onReturn={onReturnButtonClick}
        onCloseModal={onCloseModal}
      >
        {!imageBase64 && (
          <div className="flex flex-col items-center px-10">
            <CustomFileUploader
              accept={acceptMimeTypes}
              filePreprocessHandler={filePreprocessHandler}
              maxNoOfFiles={1}
              icon={<CloudArrowUpIcon className="text-text size-48 opacity-70" />}
            />
          </div>
        )}

        {imageBase64 && (
          <div className="flex flex-col gap-y-3 justify-center relative">
            {fileName && fileSize && (
              <div className="flex flex-row justify-center gap-x-5">
                <label className="font-semibold text-text text-sm">
                  {fileName}
                </label>
                <label className="font-semibold text-text text-sm">
                  {`(${fileSize})`}
                </label>
              </div>
            )}
            {!!loadImageError && (
              <label className="text-red-warning-heavy text-center text-sm font-bold">
                {loadImageError}
              </label>
            )}

            <div className="flex justify-center">
              <img
                src={imageBase64}
                alt="User Banner"
                className={`object-cover w-[${String(
                  previewBannerDimension.width
                )}px] h-[${String(previewBannerDimension.height)}px] rounded-2xl`}
              />
            </div>

            <div className="flex justify-center mt-5">
              <CustomButton
                type="submit"
                disabled={isSubmitting || !!loadImageError}
                style="profile-page-modal-edit-avatar-submit-btn"
                varient={
                  isSubmitting || !!loadImageError
                    ? "opacity-30 bg-s7 border-transparent"
                    : "hover:text-text hover:bg-transparent hover:border-dashed"
                }
                text={t("common_phases.button.upload")}
                textStyles="font-medium"
                spinner={true}
                loading={isSubmitting}
                onClick={handleSubmit}
              />
            </div>
          </div>
        )}
      </Modal>
    </Overlay>
  );
};

export default EditBannerModal;
