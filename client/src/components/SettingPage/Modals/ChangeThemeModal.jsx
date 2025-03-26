import { useMutation, useQueryClient } from "react-query";
import QUERY_KEYS from "@utils/constants/QueryKeys";
import LOCAL_STORAGE_KEYS from "@utils/constants/LocalStorageKeys";
import Overlay from "@layout/Overlay";
import Modal from "@layout/Modal";
import { useTranslation } from "react-i18next";
import useThemeMenu from "@components/common/ListGroup/ListGroupMenu/ThemeMenu";
import CustomListGroup from "@components/common/ListGroup/CustomListGroup";
import axios from "axios";
import changeUserPreferenceTheme from "@services/users/ChangeUserPreferenceTheme";
import { displayErrorToast } from "@components/common/Toast/CustomToast";
import { useTheme } from "next-themes";

const ChangeThemeModal = ({ onCloseModal, userData }) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const ThemeMenu = useThemeMenu();

  const { _, setTheme } = useTheme();

  const { mutateAsync: ChangeUserPreferenceTheme } = useMutation({
    mutationFn: changeUserPreferenceTheme,
    onSuccess: (res) => {
      queryClient.setQueryData([QUERY_KEYS.USER_DATA], res);
      localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, res.data.preference_theme);
      setTheme(res.data.preference_theme);
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
    await ChangeUserPreferenceTheme({ preference_theme: data?.value });
  };

  return (
    <Overlay>
      <Modal
        title={t("change_theme_modal.title")}
        styles="pb-2 pr-16 -mr-16 my-5"
        onCloseModal={onCloseModal}
      >
        <CustomListGroup
          varient="max-h-[300px]"
          textStyle="text-start text-sm"
          listGroupMenu={ThemeMenu}
          onMenuItemSelected={onMenuItemSelected}
          selectedData={ThemeMenu[`${userData?.preference_theme}`]?.name}
        />
      </Modal>
    </Overlay>
  );
};

export default ChangeThemeModal;
