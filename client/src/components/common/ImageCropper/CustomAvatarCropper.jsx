import { useEffect, useRef } from "react";
import {
  CROPPER_MIN_HEIGHT,
  CROPPER_MIN_WIDTH,
  cropperSetting,
} from "./CropperSetting/AvatarCropperSetting";
import Cropper from "cropperjs";

const CustomAvatarCropper = ({
  uncroppedImageBase64,
  isCropEnabled,
  receiveDataHandler,
  fileMimeType,
}) => {
  const imageRef = useRef(null);
  const cropperRef = useRef(null);

  const cropUserAvatar = () => {
    const canvas = cropperRef.current.getCroppedCanvas({
      imageSmoothingEnabled: true,
      imageSmoothingQuality: "high",
    });
    const croppedImageBase64 = canvas.toDataURL(fileMimeType);
    receiveDataHandler({ upload: croppedImageBase64, fileMimeType: fileMimeType });
  };

  useEffect(() => {
    if (uncroppedImageBase64 && imageRef.current) {
      cropperRef.current = new Cropper(imageRef.current, {
        ...cropperSetting,
        ready() {
          const containerData = cropperRef.current.getContainerData();
          cropperRef.current.setCropBoxData({
            width: CROPPER_MIN_WIDTH,
            height: CROPPER_MIN_HEIGHT,
            left: (containerData.width - CROPPER_MIN_WIDTH) / 2,
            top: (containerData.height - CROPPER_MIN_HEIGHT) / 2,
          });
        },
      });
    }

    return () => {
      if (cropperRef.current) {
        cropperRef.current.destroy();
        cropperRef.current = null;
      }
    };
  }, [uncroppedImageBase64, imageRef]);

  useEffect(() => {
    if (cropperRef && isCropEnabled) {
      cropUserAvatar();
    }
  }, [isCropEnabled]);

  return (
    <div>
      <img
        ref={imageRef}
        src={uncroppedImageBase64}
        alt="Uncropped Image"
        className="max-w-full"
      />
    </div>
  );
};

export default CustomAvatarCropper;
