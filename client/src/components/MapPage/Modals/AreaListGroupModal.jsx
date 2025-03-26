import Overlay from "@layout/Overlay";
import Modal from "@layout/Modal";
import { useTranslation } from "react-i18next";
import CustomListGroup from "@components/common/ListGroup/CustomListGroup";
import useAreaMenu from "@components/common/Dropdown/DropdownMenu/AreaMenu";
import sortObjectKeys from "@utils/helperFunctions/sortObjectKeys";

const AreaListGroupModal = ({
  onCloseModal,
  areaFilterValue,
  setAreaFilterValue,
  setDistrictFilterValue,
  setSubDistrictFilterValue,
}) => {
  const { t } = useTranslation();
  const AreaMenu = useAreaMenu();

  const onReturnButtonClick = () => {
    onCloseModal();
  };

  const onMenuItemSelected = (data) => {
    setAreaFilterValue(data.name);
    setDistrictFilterValue("");
    setSubDistrictFilterValue("");
    onCloseModal();
  };

  return (
    <Overlay>
      <Modal
        title={t("area_list_group_modal.title")}
        onCloseModal={onCloseModal}
        styles="pb-2 pr-16 -mr-16 my-5"
        isReturnButtonEnabled={true}
        onReturn={onReturnButtonClick}
      >
        <CustomListGroup
          varient="max-h-[300px]"
          textStyle="text-start text-sm"
          listGroupMenu={sortObjectKeys(AreaMenu)}
          onMenuItemSelected={onMenuItemSelected}
          selectedData={areaFilterValue}
        />
      </Modal>
    </Overlay>
  );
};

export default AreaListGroupModal;
