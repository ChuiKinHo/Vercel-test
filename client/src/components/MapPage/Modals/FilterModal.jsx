import { useState } from "react";
import Overlay from "@layout/Overlay";
import Modal from "@layout/Modal";
import { useTranslation } from "react-i18next";
import AreaListGroupModal from "./AreaListGroupModal";
import DistrictListGroupModal from "./DistrictListGroupModal";
import SubDistrictListGroupModal from "./SubDistrictListGroupModal";
import CustomButton from "@components/common/Button/CustomButton";
import { LiaMaleSolid, LiaFemaleSolid, LiaBathSolid } from "react-icons/lia";
import { PiWheelchair } from "react-icons/pi";
import CustomToggleButton from "@components/common/ToggleButton/CustomToggleButton";
import TypeOfToiletModal from "../Modals/TypeOfToiletModal";
import { TOILET_TOGGLE_STATES } from "@components/common/ToggleButton/ToggleStates";

const FilterModal = ({
  onCloseModal,
  setAreaFilterValue,
  setDistrictFilterValue,
  setSubDistrictFilterValue,
  setTypeOfToiletFilterValue,
  setIsMaleFilterValue,
  setIsFemaleFilterValue,
  setIsDisabledFilterValue,
  setHaveBathroomFilterValue,
  areaFilterValue,
  districtFilterValue,
  subDistrictFilterValue,
  typeOfToiletFilterValue,
  isMaleFilterValue,
  isFemaleFilterValue,
  isDisabledFilterValue,
  haveBathroomFilterValue,
}) => {
  const { t } = useTranslation();

  const [openAreaListGroupModal, setOpenAreaListGroupModal] = useState(false);
  const [openDistictListGroupModal, setOpenDistrictListGroupModal] =
    useState(false);
  const [openSubDistrictListGroupModal, setOpenSubDistrictListGroupModal] =
    useState(false);
  const [openTypeOfToiletModal, setOpenTypeOfToiletModal] = useState(false);

  const onMaleToggled = () => {
    const nextStateIndex =
      (TOILET_TOGGLE_STATES.indexOf(isMaleFilterValue) + 1) %
      TOILET_TOGGLE_STATES.length;
    setIsMaleFilterValue(TOILET_TOGGLE_STATES[nextStateIndex]);
  };

  const onFemaleToggled = () => {
    const nextStateIndex =
      (TOILET_TOGGLE_STATES.indexOf(isFemaleFilterValue) + 1) %
      TOILET_TOGGLE_STATES.length;
    setIsFemaleFilterValue(TOILET_TOGGLE_STATES[nextStateIndex]);
  };

  const onDisabledToggled = () => {
    const nextStateIndex =
      (TOILET_TOGGLE_STATES.indexOf(isDisabledFilterValue) + 1) %
      TOILET_TOGGLE_STATES.length;
    setIsDisabledFilterValue(TOILET_TOGGLE_STATES[nextStateIndex]);
  };

  const onBathroomToggled = () => {
    const nextStateIndex =
      (TOILET_TOGGLE_STATES.indexOf(haveBathroomFilterValue) + 1) %
      TOILET_TOGGLE_STATES.length;
    setHaveBathroomFilterValue(TOILET_TOGGLE_STATES[nextStateIndex]);
  };

  return (
    <Overlay>
      <Modal
        title={t("filter_modal.title")}
        onCloseModal={onCloseModal}
        styles="pb-2 pr-16 -mr-16 my-5"
      >
        <div className="mt-2 flex flex-col gap-y-5 w-full">
          <div
            className={`grid grid-cols-2 p-3 shadow-md rounded-lg ${
              areaFilterValue ? "bg-s2" : "bg-s1"
            }`}
            onClick={() => setOpenAreaListGroupModal(true)}
          >
            <div className="justify-self-start">
              <label className="font-semibold">{t("filter_modal.area")}</label>
            </div>
            <div className="justify-self-end">
              <p className="text-sm text-end text-s8">{areaFilterValue}</p>
            </div>
          </div>

          <div
            className={`grid grid-cols-2 p-3 shadow-md rounded-lg ${
              districtFilterValue ? "bg-s2" : "bg-s1"
            }`}
            onClick={() => setOpenDistrictListGroupModal(true)}
          >
            <div className="justify-self-start">
              <label className="font-semibold">
                {t("filter_modal.district")}
              </label>
            </div>
            <div className="justify-self-end">
              <p className="text-sm text-end text-s8">{districtFilterValue}</p>
            </div>
          </div>

          <div
            className={`grid grid-cols-2 p-3 shadow-md rounded-lg ${
              subDistrictFilterValue ? "bg-s2" : "bg-s1"
            }`}
            onClick={() => setOpenSubDistrictListGroupModal(true)}
          >
            <div className="justify-self-start">
              <label className="font-semibold">
                {t("filter_modal.sub_district")}
              </label>
            </div>
            <div className="justify-self-end">
              <p className="text-sm text-end text-s8">
                {subDistrictFilterValue}
              </p>
            </div>
          </div>

          {/* Type of Toilet */}
          <div className="mt-5 flex flex-col gap-y-3">
            <p className="text-base tracking-wide font-semibold">
              {t("common_phases.form.labels.type_of_toilet")}
            </p>
            <div
              className={`flex justify-center items-center shadow-sm min-h-[110px] rounded-lg ${
                typeOfToiletFilterValue
                  ? "bg-blue-100 border-2 border-blue-light"
                  : "bg-s2"
              }`}
              onClick={() => setOpenTypeOfToiletModal(true)}
            >
              {!typeOfToiletFilterValue && (
                <p className="text-center text-sm italic text-text opacity-30">
                  {t("common_phases.form.placeholders.click_to_select")}
                </p>
              )}
              {typeOfToiletFilterValue && (
                <div className="flex gap-x-2">
                  {typeOfToiletFilterValue && (
                    <span className="text-text">
                      {typeOfToiletFilterValue.icon}
                    </span>
                  )}
                  <p className="text-center text-sm font-semibold text-text">
                    {typeOfToiletFilterValue.name}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 justify-center">
            {/* Male */}
            <div
              className={`flex flex-col gap-y-6 justify-center items-center shadow-sm min-w-[160px] min-h-[120px] rounded-lg ${
                isMaleFilterValue === "true"
                  ? "bg-blue-100/50 border-2 border-blue-light"
                  : isMaleFilterValue === "false"
                  ? "bg-red-100/50 border-2 border-red-300"
                  : "bg-s2"
              }`}
              onClick={onMaleToggled}
            >
              <div className="flex gap-x-0.5">
                <LiaMaleSolid className="size-5 text-s8" />
                <label htmlFor="male" className="text-sm font-semibold text-s8">
                  {t("toilet_categories.male")}
                </label>
              </div>

              <CustomToggleButton
                toggleState={isMaleFilterValue}
                onToggled={onMaleToggled}
              />
            </div>

            {/* Female */}
            <div
              className={`flex flex-col gap-y-6 justify-center items-center shadow-sm min-w-[160px] min-h-[120px] rounded-lg ${
                isFemaleFilterValue === "true"
                  ? "bg-blue-100/50 border-2 border-blue-light"
                  : isFemaleFilterValue === "false"
                  ? "bg-red-100/50 border-2 border-red-300"
                  : "bg-s2"
              }`}
              onClick={onFemaleToggled}
            >
              <div className="flex gap-x-0.5">
                <LiaFemaleSolid className="size-5 text-s8" />
                <label
                  htmlFor="Female"
                  className="text-sm font-semibold text-s8"
                >
                  {t("toilet_categories.female")}
                </label>
              </div>

              <CustomToggleButton
                toggleState={isFemaleFilterValue}
                onToggled={onFemaleToggled}
              />
            </div>

            {/* Disabled */}
            <div
              className={`flex flex-col gap-y-6 justify-center items-center shadow-sm min-w-[160px] min-h-[120px] rounded-lg ${
                isDisabledFilterValue === "true"
                  ? "bg-blue-100/50 border-2 border-blue-light"
                  : isDisabledFilterValue === "false"
                  ? "bg-red-100/50 border-2 border-red-300"
                  : "bg-s2"
              }`}
              onClick={onDisabledToggled}
            >
              <div className="flex gap-x-1.5">
                <PiWheelchair className="size-5 text-s8" />
                <label
                  htmlFor="disabled"
                  className="text-sm font-semibold text-s8"
                >
                  {t("toilet_categories.disabled")}
                </label>
              </div>

              <CustomToggleButton
                toggleState={isDisabledFilterValue}
                onToggled={onDisabledToggled}
              />
            </div>

            {/* Bathroom */}
            <div
              className={`flex flex-col gap-y-6 justify-center items-center shadow-sm min-w-[160px] min-h-[120px] rounded-lg ${
                haveBathroomFilterValue === "true"
                  ? "bg-blue-100/50 border-2 border-blue-light"
                  : haveBathroomFilterValue === "false"
                  ? "bg-red-100/50 border-2 border-red-300"
                  : "bg-s2"
              }`}
              onClick={onBathroomToggled}
            >
              <div className="flex gap-x-1.5">
                <LiaBathSolid className="size-5 text-s8" />
                <label
                  htmlFor="bathroom"
                  className="text-sm font-semibold text-s8"
                >
                  {t("toilet_categories.bathroom")}
                </label>
              </div>

              <CustomToggleButton
                toggleState={haveBathroomFilterValue}
                onToggled={onBathroomToggled}
              />
            </div>
          </div>

          {(areaFilterValue ||
            districtFilterValue ||
            subDistrictFilterValue ||
            isMaleFilterValue ||
            isFemaleFilterValue ||
            isDisabledFilterValue ||
            haveBathroomFilterValue ||
            typeOfToiletFilterValue) && (
            <div className="mt-5">
              <CustomButton
                type="button"
                style="login-submit-btn"
                text={t("common_phases.button.enter")}
                textStyles="font-semibold"
                onClick={onCloseModal}
              />
            </div>
          )}
        </div>

        {openAreaListGroupModal && (
          <AreaListGroupModal
            onCloseModal={() => setOpenAreaListGroupModal(false)}
            setAreaFilterValue={setAreaFilterValue}
            setDistrictFilterValue={setDistrictFilterValue}
            setSubDistrictFilterValue={setSubDistrictFilterValue}
            areaFilterValue={areaFilterValue}
          />
        )}

        {openDistictListGroupModal && (
          <DistrictListGroupModal
            onCloseModal={() => setOpenDistrictListGroupModal(false)}
            setAreaFilterValue={setAreaFilterValue}
            setDistrictFilterValue={setDistrictFilterValue}
            setSubDistrictFilterValue={setSubDistrictFilterValue}
            areaFilterValue={areaFilterValue}
            districtFilterValue={districtFilterValue}
          />
        )}

        {openSubDistrictListGroupModal && (
          <SubDistrictListGroupModal
            onCloseModal={() => setOpenSubDistrictListGroupModal(false)}
            setAreaFilterValue={setAreaFilterValue}
            setDistrictFilterValue={setDistrictFilterValue}
            setSubDistrictFilterValue={setSubDistrictFilterValue}
            areaFilterValue={areaFilterValue}
            districtFilterValue={districtFilterValue}
            subDistrictFilterValue={subDistrictFilterValue}
          />
        )}

        {openTypeOfToiletModal && (
          <TypeOfToiletModal
            onCloseModal={() => setOpenTypeOfToiletModal(false)}
            typeOfToilet={typeOfToiletFilterValue}
            setTypeOfToilet={(menuItem) => setTypeOfToiletFilterValue(menuItem)}
          />
        )}
      </Modal>
    </Overlay>
  );
};

export default FilterModal;
