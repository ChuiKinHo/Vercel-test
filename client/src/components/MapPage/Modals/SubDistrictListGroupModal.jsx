import { useState, useEffect } from "react";
import Overlay from "@layout/Overlay";
import Modal from "@layout/Modal";
import { useTranslation } from "react-i18next";
import CustomListGroup from "@components/common/ListGroup/CustomListGroup";
import useSubDistrictMenu from "@components/common/Dropdown/DropdownMenu/SubDistrictMenu";
import sortObjectKeys from "@utils/helperFunctions/sortObjectKeys";

const SubDistrictListGroupModal = ({
  onCloseModal,
  setAreaFilterValue,
  setDistrictFilterValue,
  setSubDistrictFilterValue,
  areaFilterValue,
  districtFilterValue,
  subDistrictFilterValue,
}) => {
  const { t } = useTranslation();
  const SubDistrictMenu = useSubDistrictMenu()
  const [updatedSubDistrictMenu, setUpdatedSubDistrictMenu] =
    useState(SubDistrictMenu);

  useEffect(() => {
    if (districtFilterValue) {
      // filter the value
      const updatedMenu = Object.entries(SubDistrictMenu)
        .map(([key, data]) => {
          return data.district === districtFilterValue ? data : null;
        })
        .filter((item) => item !== null);
      setUpdatedSubDistrictMenu(updatedMenu);
    } else if (areaFilterValue) {
      // filter the value
      const updatedMenu = Object.entries(SubDistrictMenu)
        .map(([key, data]) => {
          return data.area === areaFilterValue ? data : null;
        })
        .filter((item) => item !== null);
      setUpdatedSubDistrictMenu(updatedMenu);
    }
  }, [districtFilterValue, areaFilterValue]);

  const onReturnButtonClick = () => {
    onCloseModal();
  };

  const onMenuItemSelected = (data) => {
    setSubDistrictFilterValue(data.name);
    setDistrictFilterValue(data.district);
    setAreaFilterValue(data.area);
    onCloseModal();
  };

  return (
    <Overlay>
      <Modal
        title={t("sub_district_list_group_modal.title")}
        onCloseModal={onCloseModal}
        styles="pb-2 pr-16 -mr-16 my-5"
        isReturnButtonEnabled={true}
        onReturn={onReturnButtonClick}
      >
        <CustomListGroup
          varient="max-h-[300px]"
          textStyle="text-start text-sm"
          listGroupMenu={sortObjectKeys(updatedSubDistrictMenu)}
          onMenuItemSelected={onMenuItemSelected}
          selectedData={subDistrictFilterValue}
        />
      </Modal>
    </Overlay>
  );
};

export default SubDistrictListGroupModal;
