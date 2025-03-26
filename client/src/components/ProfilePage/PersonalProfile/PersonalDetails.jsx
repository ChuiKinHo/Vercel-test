import React, { useState, useEffect } from "react";
import ProfileDetailLabels from "./Labels/Labels";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import CustomButton from "@components/common/Button/CustomButton";
import usePersonalDetailsPreset from "../../../utils/constants/PersonalDetailsPreset";
import EditProfileModal from "../Modals/EditProfileModal";
import CustomTooltip from "@components/common/Tooltips/CustomTooltip";
import { useTranslation } from "react-i18next";

const ProfilePersonalDetails = ({ userData, isGuest }) => {
  const { t } = useTranslation();
  const PersonalDetailsPreset = usePersonalDetailsPreset();

  const [personalDetails, setPersonalDetails] = useState(null);
  const [editablepPrsonalDetails, setEditablePersonalDetails] = useState(null);
  const [isOpenEditProfileModal, setOpenEditProfileModal] = useState(false);

  useEffect(() => {
    const updatedPersonalDetails = {};
    const updatedEditablePersonalDetails = {};

    Object.entries(PersonalDetailsPreset).forEach(([key, value]) => {
      updatedPersonalDetails[key] = {
        ...value,
        data: userData?.[key],
      };
    });
    setPersonalDetails(updatedPersonalDetails);

    Object.entries(PersonalDetailsPreset).forEach(([key, value]) => {
      if (value.editable) {
        updatedEditablePersonalDetails[key] = {
          ...value,
          data: userData?.[key],
        };
      }
      setEditablePersonalDetails(updatedEditablePersonalDetails);
    });
  }, [userData]);

  return (
    <div>
      <div className={`flex justify-end ${isGuest ? "py-3" : ""}`}>
        {!isGuest && (
          <div className="py-3">
            <CustomButton
              type="button"
              icon={<PencilSquareIcon className="size-6 text-s6" />}
              style="profile-page-edit-enabled-btn"
              tooltip={
                <CustomTooltip
                  text={t("profile_page.tooltips.edit")}
                  textStyle="text-s1 text-xs text-center"
                  varient="mb-4 -translate-x-2.5"
                  arrowDirection="bottom"
                  placement="top"
                />
              }
              onClick={() => setOpenEditProfileModal(true)}
            />
          </div>
        )}
      </div>

      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6 md:gap-y-10 justify-items-center 
                  w-full h-full max-h-[300px] md:px-12 md:py-2 overflow-y-auto md:scroll-bar-appearance"
      >
        {personalDetails && (
          <ProfileDetailLabels
            personalDetails={personalDetails}
            isOpenEditProfileModal={false}
          />
        )}
      </div>

      {isOpenEditProfileModal && (
        <div className="w-full flex flex-row gay-x-10">
          {editablepPrsonalDetails && (
            <EditProfileModal
              userData={userData}
              personalDetails={editablepPrsonalDetails}
              onCloseModal={() => setOpenEditProfileModal(false)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePersonalDetails;
