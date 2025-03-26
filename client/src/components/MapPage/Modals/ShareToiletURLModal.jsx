import { useState } from "react";
import Overlay from "@layout/Overlay";
import Modal from "@layout/Modal";
import { useTranslation } from "react-i18next";
import CustomClipboard from "@components/common/Clipboard/CustomClipboard";
import CustomButton from "@components/common/Button/CustomButton";
import { FaWhatsapp } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaSignalMessenger } from "react-icons/fa6";
import { FiLink } from "react-icons/fi";

const ShareToiletURLModal = ({ onCloseModal, shareToiletURL }) => {
  const { t } = useTranslation();

  const shareURLToNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "ToiletGuide Toilet Location",
          text: `Here's a toilet location you might need: ${shareToiletURL}`,
          url: shareToiletURL,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    }
  };

  const shareURLToWhatsapp = () => {
    navigator.clipboard.writeText(shareToiletURL);
    const encodedURL = encodeURIComponent(shareToiletURL);
    window.open(`https://wa.me/?text=${encodedURL}`, "_blank");
  };

  const shareURLToInstagram = () => {
    navigator.clipboard.writeText(shareToiletURL);
    window.open(`https://www.instagram.com/direct/inbox/`, "_blank");
  };

  const shareURLToSignal = () => {
    navigator.clipboard.writeText(shareToiletURL);
    const encodedURL = encodeURIComponent(shareToiletURL);
    window.open(`sgnl://send?text=${encodedURL}`, "_blank");
  };

  return (
    <Overlay>
      <Modal
        title={t("share_toilet_url_modal.title")}
        onCloseModal={onCloseModal}
        styles="pb-2 pr-16 -mr-16 my-5"
      >
        <div className="flex flex-col gap-y-5">
          <CustomClipboard textToCopy={shareToiletURL} />

          <div className="mt-3 flex w-full items-center gap-2">
            <div className="w-1/2 border border-s3"></div>
            <p className="text-s5 text-sm font-semibold">
              {t("login_page.or")}
            </p>
            <div className="w-1/2 border border-s3"></div>
          </div>

          <div className="flex justify-center gap-x-10 rounded-xl py-4 bg-s2">
            <CustomButton
              icon={<FiLink className="size-8 text-text" />}
              onClick={shareURLToNative}
            />
            <CustomButton
              icon={<FaWhatsapp className="size-8 text-text" />}
              onClick={shareURLToWhatsapp}
            />
            <CustomButton
              icon={<FaInstagram className="size-8 text-text" />}
              onClick={shareURLToInstagram}
            />
            <CustomButton
              icon={<FaSignalMessenger className="size-8 text-text" />}
              onClick={shareURLToSignal}
            />
          </div>
        </div>
      </Modal>
    </Overlay>
  );
};

export default ShareToiletURLModal;
