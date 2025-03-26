import Overlay from "@layout/Overlay";
import Modal from "@layout/Modal";
import { useTranslation } from "react-i18next";
import CustomButton from "@components/common/Button/CustomButton";
import { useRouter } from "next/navigation";
import LOCAL_STORAGE_KEYS from "@utils/constants/LocalStorageKeys";
import WEB_ROUTE_PATHS from "@utils/constants/WebRoutes";

const LoginRequiredModal = ({ onCloseModal }) => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Overlay>
      <Modal
        title={t("login_required_modal.title")}
        onCloseModal={onCloseModal}
        styles="pb-2 pr-16 -mr-16 mt-5"
      >
        <p className="text-base text-s6 mb-7 text-center">
          {t("login_required_modal.prompt")}
        </p>
        <div className="flex justify-center gap-x-16">
          <CustomButton
            type="button"
            style="login-required-modal-cancel-btn"
            text={t("login_required_modal.cancel")}
            varient="font-semibold"
            onClick={onCloseModal}
          />

          <CustomButton
            type="button"
            style="login-required-modal-login-btn"
            varient="font-semibold"
            text={t("login_required_modal.login")}
            textStyles=""
            onClick={() => {
              localStorage.setItem(
                LOCAL_STORAGE_KEYS.CURRENT_URL,
                `${WEB_ROUTE_PATHS.login}`
              );
              router.push(WEB_ROUTE_PATHS.login);
            }}
          />
        </div>
      </Modal>
    </Overlay>
  );
};

export default LoginRequiredModal;
