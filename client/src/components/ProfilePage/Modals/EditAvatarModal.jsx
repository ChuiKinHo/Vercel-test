import React, { useState } from "react";
import Overlay from "@layout/Overlay";
import Modal from "@layout/Modal";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import CustomFileUploader from "@components/common/FileUploader/CustomFileUploader";
import CustomButton from "@components/common/Button/CustomButton";
import { useMutation, useQueryClient } from "react-query";
import QUERY_KEYS from "@utils/constants/QueryKeys";
import editUserAvatar from "@services/users/editUserAvatar";
import axios from "axios";
import fileSizeFormatter from "@utils/helperFunctions/fileSizeFormatter";
import getImageDimension from "@utils/helperFunctions/getImageDimension";
import CustomAvatarCropper from "@components/common/ImageCropper/CustomAvatarCropper";
import { useTranslation } from "react-i18next";
import {
  CROPPER_MIN_HEIGHT,
  CROPPER_MIN_WIDTH,
} from "@components/common/ImageCropper/CropperSetting/AvatarCropperSetting";
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

const maxFileSize = 10 * 1024 * 1024; // 10 MB

const EditAvatarModal = ({ onCloseModal }) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(null);
  const [fileMimeType, setFileMimeType] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [loadImageError, setLoadImageError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutateAsync: EditUserAvatar } = useMutation({
    mutationFn: editUserAvatar,
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

  const receiveCroppedImageHandler = async ({ upload, fileMimeType }) => {
    try {
      await EditUserAvatar({ upload, fileMimeType });
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
          `${t("edit_avatar_modal.image_exceed")} ${fileSizeFormatter(
            maxFileSize
          )}. ${t("edit_avatar_modal.select_another_images")}`
        );
      } else if (
        imageDimension.naturalWidth < CROPPER_MIN_WIDTH ||
        imageDimension.naturalHeight < CROPPER_MIN_HEIGHT
      ) {
        setLoadImageError(
          `${t(
            "edit_avatar_modal.image_at_least"
          )} ${CROPPER_MIN_WIDTH} x ${CROPPER_MIN_HEIGHT}`
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
        title={t("edit_avatar_modal.title")}
        onCloseModal={onCloseModal}
        isReturnButtonEnabled={!isSubmitting}
        onReturn={onReturnButtonClick}
        styles="pb-2 pr-16 -mr-16 my-5"
      >
        {imageBase64 ? (
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

            <CustomAvatarCropper
              uncroppedImageBase64={imageBase64}
              isCropEnabled={isSubmitting}
              receiveDataHandler={receiveCroppedImageHandler}
              fileMimeType={fileMimeType}
            />

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
                onClick={() => setIsSubmitting(true)}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center px-10">
            <CustomFileUploader
              accept={acceptMimeTypes}
              filePreprocessHandler={filePreprocessHandler}
              maxNoOfFiles={1}
              icon={<CloudArrowUpIcon className="text-text size-48 opacity-70" />}
            />
          </div>
        )}
      </Modal>
    </Overlay>
  );
};

export default EditAvatarModal;
