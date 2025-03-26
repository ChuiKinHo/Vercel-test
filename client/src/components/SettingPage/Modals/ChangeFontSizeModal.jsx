import { useMutation, useQueryClient } from "react-query";
import QUERY_KEYS from "@utils/constants/QueryKeys";
import LOCAL_STORAGE_KEYS from "@utils/constants/LocalStorageKeys";
import Overlay from "@layout/Overlay";
import Modal from "@layout/Modal";
import { useTranslation } from "react-i18next";
import useFontSizeMenu from "@components/common/ListGroup/ListGroupMenu/FontSizeMenu";
import CustomListGroup from "@components/common/ListGroup/CustomListGroup";
import axios from "axios";
import changeUserPreferenceFontSize from "@services/users//ChangeUserPreferenceFontSize";
import { displayErrorToast } from "@components/common/Toast/CustomToast";
import { useFontSize } from "@contexts/FontSizeProvider";

const ChangeFontSizeModal = ({ onCloseModal, userData }) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const FontSizeMenu = useFontSizeMenu();
  const { changeFontSize } = useFontSize();

  const { mutateAsync: ChangeUserPreferenceFontSize } = useMutation({
    mutationFn: changeUserPreferenceFontSize,
    onSuccess: (res) => {
      queryClient.setQueryData([QUERY_KEYS.USER_DATA], res);
      changeFontSize({ fontSize: res?.data?.preference_font_size });
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
    await ChangeUserPreferenceFontSize({ preference_font_size: data?.value });
  };

  return (
    <Overlay>
      <Modal
        title={t("change_font_size_modal.title")}
        styles="pb-2 pr-16 -mr-16 my-5"
        onCloseModal={onCloseModal}
      >
        <CustomListGroup
          varient="max-h-[300px]"
          textStyle="text-start text-sm"
          listGroupMenu={FontSizeMenu}
          onMenuItemSelected={onMenuItemSelected}
          selectedData={FontSizeMenu[`${userData?.preference_font_size}`]?.name}
        />
      </Modal>
    </Overlay>
  );
};

export default ChangeFontSizeModal;
