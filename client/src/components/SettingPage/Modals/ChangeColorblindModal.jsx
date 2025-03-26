import { useMutation, useQueryClient } from "react-query";
import QUERY_KEYS from "@utils/constants/QueryKeys";
import Overlay from "@layout/Overlay";
import Modal from "@layout/Modal";
import { useTranslation } from "react-i18next";
import CustomListGroup from "@components/common/ListGroup/CustomListGroup";
import axios from "axios";
import { displayErrorToast } from "@components/common/Toast/CustomToast";
import { useColorblind } from "@contexts/ColorblindProvider";
import useColorblindMenu from "@components/common/ListGroup/ListGroupMenu/ColorblindMenu";
import changeUserPreferenceColorblind from "@services/users/ChangeUserPreferenceColorblind";

const ChangeColorblindModal = ({ onCloseModal, userData }) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const ColorblindMenu = useColorblindMenu();
  const { changeColorblind } = useColorblind();

  const { mutateAsync: ChangeUserPreferenceColorblind } = useMutation({
    mutationFn: changeUserPreferenceColorblind,
    onSuccess: (res) => {
      queryClient.setQueryData([QUERY_KEYS.USER_DATA], res);
      changeColorblind({
        colorblind: res?.data?.preference_colorblind || "default",
      });
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
    await ChangeUserPreferenceColorblind({
      preference_colorblind: data?.value,
    });
  };

  return (
    <Overlay>
      <Modal
        title={t("change_colorblind_modal.title")}
        styles="pb-2 pr-16 -mr-16 my-5"
        onCloseModal={onCloseModal}
      >
        <CustomListGroup
          varient="max-h-[300px]"
          textStyle="text-start text-sm"
          listGroupMenu={ColorblindMenu}
          onMenuItemSelected={onMenuItemSelected}
          selectedData={
            ColorblindMenu[`${userData?.preference_colorblind}`]?.name
          }
        />
      </Modal>
    </Overlay>
  );
};

export default ChangeColorblindModal;
