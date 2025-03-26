import React from "react";
import {
  PhotoIcon as PhotoIconOutline,
  ChatBubbleBottomCenterTextIcon as ChatBubbleBottomCenterTextIconOutline,
} from "@heroicons/react/24/outline";
import {
  PhotoIcon as PhotoIconSolid,
  ChatBubbleBottomCenterTextIcon as ChatBubbleBottomCenterTextIconSolid,
} from "@heroicons/react/24/solid";
import CustomButton from "@components/common/Button/CustomButton";
import { useTranslation } from "react-i18next";

const TOILET_DRAWER_NAVIGATION_BUTTON_STATE = {
  MULTIMEDIA: "multimedia",
  COMMENTS: "comments",
};

const ToiletDrawerNavigationBar = ({
  buttonState = TOILET_DRAWER_NAVIGATION_BUTTON_STATE.MULTIMEDIA,
  onMultimediaBtnClick,
  onCommentsBtnClick,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-row justify-center w-full">
      <div className="w-1/2">
        <CustomButton
          type="button"
          style="toilet-drawer-navigation-bar-btn"
          varient={
            buttonState === TOILET_DRAWER_NAVIGATION_BUTTON_STATE.MULTIMEDIA
              ? "border-gray-heavy opacity-100"
              : "border-gray-light-semi opacity-50 hover:border-s3"
          }
          icon={
            buttonState === TOILET_DRAWER_NAVIGATION_BUTTON_STATE.MULTIMEDIA ? (
              <PhotoIconSolid className="size-5" />
            ) : (
              <PhotoIconOutline className="size-5" />
            )
          }
          onClick={onMultimediaBtnClick}
        />
      </div>

      <div className="w-1/2">
        <CustomButton
          type="button"
          style="toilet-drawer-navigation-bar-btn"
          varient={
            buttonState === TOILET_DRAWER_NAVIGATION_BUTTON_STATE.COMMENTS
              ? "border-gray-heavy opacity-100"
              : "border-gray-light-semi opacity-50 hover:border-s3"
          }
          icon={
            buttonState === TOILET_DRAWER_NAVIGATION_BUTTON_STATE.COMMENTS ? (
              <ChatBubbleBottomCenterTextIconSolid className="size-5" />
            ) : (
              <ChatBubbleBottomCenterTextIconOutline className="size-5" />
            )
          }
          onClick={onCommentsBtnClick}
        />
      </div>
    </div>
  );
};

export default ToiletDrawerNavigationBar;
