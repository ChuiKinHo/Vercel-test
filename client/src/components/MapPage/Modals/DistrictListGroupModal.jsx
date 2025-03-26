import { useState, useEffect } from "react";
import Overlay from "@layout/Overlay";
import Modal from "@layout/Modal";
import { useTranslation } from "react-i18next";
import CustomListGroup from "@components/common/ListGroup/CustomListGroup";
import useDistrictMenu from "@components/common/Dropdown/DropdownMenu/DistrictMenu";
import sortObjectKeys from "@utils/helperFunctions/sortObjectKeys";

const DistrictListGroupModal = ({
  onCloseModal,
  setAreaFilterValue,
  setDistrictFilterValue,
  setSubDistrictFilterValue,
  areaFilterValue,
  districtFilterValue,
}) => {
  const { t } = useTranslation();
  const DistrictMenu = useDistrictMenu()

  const [updatedDistrictMenu, setUpdatedDistrictMenu] = useState(DistrictMenu);

  useEffect(() => {
    if (areaFilterValue) {
      // filter the value
      const updatedMenu = Object.entries(DistrictMenu)
        .map(([key, data]) => {
          return data.area === areaFilterValue ? data : null;
        })
        .filter((item) => item !== null);
      setUpdatedDistrictMenu(updatedMenu);
    }
  }, [areaFilterValue]);

  const onReturnButtonClick = () => {
    onCloseModal();
  };

  const onMenuItemSelected = (data) => {
    setDistrictFilterValue(data.name);
    setAreaFilterValue(data.area);
    setSubDistrictFilterValue("");
    onCloseModal();
  };

  return (
    <Overlay>
      <Modal
        title={t("district_list_group_modal.title")}
        onCloseModal={onCloseModal}
        styles="pb-2 pr-16 -mr-16 my-5"
        isReturnButtonEnabled={true}
        onReturn={onReturnButtonClick}
      >
        <CustomListGroup
          varient="max-h-[300px]"
          textStyle="text-start text-sm"
          listGroupMenu={sortObjectKeys(updatedDistrictMenu)}
          onMenuItemSelected={onMenuItemSelected}
          selectedData={districtFilterValue}
        />
      </Modal>
    </Overlay>
  );
};

export default DistrictListGroupModal;
