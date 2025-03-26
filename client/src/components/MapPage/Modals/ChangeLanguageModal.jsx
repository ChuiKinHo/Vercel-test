import { useMutation, useQueryClient } from "react-query";
import QUERY_KEYS from "@utils/constants/QueryKeys";
import Overlay from "@layout/Overlay";
import Modal from "@layout/Modal";
import { useTranslation } from "react-i18next";
import useLanguageMenu from "@components/common/ListGroup/ListGroupMenu/LanguageMenu";
import CustomListGroup from "@components/common/ListGroup/CustomListGroup";
import axios from "axios";
import changeUserPreferenceLanguage from "@services/users/changeUserPreferenceLanguage";
import { useLanguage } from "@contexts/LanguageProvider";
import { displayErrorToast } from "@components/common/Toast/CustomToast";

const ChangeLanguageModal = ({
  userData,
  onCloseModal,
  updateMapLanguage,
  setUserPreferenceLanguage,
}) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const LanguageMenu = useLanguageMenu();
  const { changeLanguage } = useLanguage();

  const { mutateAsync: ChangeUserPreferenceLanguage } = useMutation({
    mutationFn: changeUserPreferenceLanguage,
    onSuccess: (res) => {
      if (res.data.userId) {
        queryClient.setQueryData([QUERY_KEYS.USER_DATA], res);
        changeLanguage({ language: res?.data?.preference_language });
        setUserPreferenceLanguage(
          LanguageMenu[`${res?.data?.preference_language}`].name
        );
        // Change Language in Mapbox
        updateMapLanguage(
          res?.data?.preference_language === "en_us" ? "en" : "zh-Hant"
        );
      } else {
        changeLanguage({ language: res.data });
        setUserPreferenceLanguage(LanguageMenu[`${res.data}`].name);
        updateMapLanguage(res.data === "en_us" ? "en" : "zh-Hant");
      }
      onCloseModal();
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        displayErrorToast(err.response?.data?.message);
        return;
      }
    },
  });

  const onMenuItemSelected = async (data) => {
    await ChangeUserPreferenceLanguage({ preference_language: data?.value });
  };

  return (
    <Overlay>
      <Modal
        title={t("change_language_modal.title")}
        styles="pb-2 pr-16 -mr-16 my-5"
        onCloseModal={onCloseModal}
      >
        <CustomListGroup
          varient="max-h-[300px]"
          textStyle="text-start text-sm"
          listGroupMenu={LanguageMenu}
          onMenuItemSelected={onMenuItemSelected}
          selectedData={LanguageMenu[`${userData?.preference_language}`]?.name}
        />
      </Modal>
    </Overlay>
  );
};

export default ChangeLanguageModal;
