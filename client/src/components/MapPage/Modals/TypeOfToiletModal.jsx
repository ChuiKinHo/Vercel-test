import Overlay from "@layout/Overlay";
import Modal from "@layout/Modal";
import { useTranslation } from "react-i18next";
import CustomListGroup from "@components/common/ListGroup/CustomListGroup";
import useTypeOfToiletMenu from "@components/common/ListGroup/ListGroupMenu/TypeOfToiletMenu";

const TypeOfToiletModal = ({
  onCloseModal,
  typeOfToilet,
  setTypeOfToilet,
  setFieldValue,
}) => {
  const { t } = useTranslation();
  const TypeOfToiletMenu = useTypeOfToiletMenu();

  const onMenuItemSelected = (menuItem) => {
    setTypeOfToilet(menuItem);
    if (setFieldValue) {
      setFieldValue("type_of_toilet", menuItem.value);
    }
    onCloseModal();
  };

  return (
    <Overlay>
      <Modal
        title={t("type_of_toilet_modal.title")}
        onCloseModal={onCloseModal}
        styles="pb-2 pr-16 -mr-16 my-5"
      >
        <CustomListGroup
          varient="max-h-[300px]"
          textStyle="text-start text-sm"
          listGroupMenu={TypeOfToiletMenu}
          onMenuItemSelected={onMenuItemSelected}
          selectedData={typeOfToilet?.name}
        />
      </Modal>
    </Overlay>
  );
};

export default TypeOfToiletModal;
