import React from "react";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import { UserCircleIcon, PhotoIcon } from "@heroicons/react/24/solid";
import CustomButton from "@components/common/Button/CustomButton";
import CustomTooltip from "@components/common/Tooltips/CustomTooltip";
import { useTranslation } from "react-i18next";

const ButtonStates = {
  PROFILE: "profile",
  FRIENDS: "friends",
};

const ProfileNavigationBar = ({
  buttonState,
  onClickPersonalDetails,
  onClickFriendsDetails,
}) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-row justify-center mt-10 md:mt-16 w-full">
      <div className="w-1/2">
        <CustomButton
          type="button"
          style="profile-page-navigation-bar-btn"
          varient={
            buttonState === ButtonStates.PROFILE
              ? "border-gray-heavy opacity-100"
              : "border-gray-light-semi opacity-50 hover:border-s3"
          }
          icon={<UserCircleIcon className="size-8" />}
          tooltip={
            <CustomTooltip
              text={t("profile_page.tooltips.profile")}
              textStyle="text-s1 text-xs text-center"
              varient="-translate-x-3.5 mb-4"
              arrowDirection="bottom"
              placement="top"
            />
          }
          onClick={onClickPersonalDetails}
        />
      </div>

      <div className="w-1/2">
        <CustomButton
          type="button"
          style="profile-page-navigation-bar-btn"
          varient={
            buttonState === ButtonStates.FRIENDS
              ? "border-gray-heavy opacity-100"
              : "border-gray-light-semi opacity-50 hover:border-s3"
          }
          tooltip={
            <CustomTooltip
              text={t("profile_page.tooltips.friends")}
              textStyle="text-s1 text-xs text-center"
              varient="-translate-x-3.5 mb-4"
              arrowDirection="bottom"
              placement="top"
            />
          }
          icon={<UserGroupIcon className="size-8" />}
          onClick={onClickFriendsDetails}
        />
      </div>
    </div>
  );
};

export default ProfileNavigationBar;
