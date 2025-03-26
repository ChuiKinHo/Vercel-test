import React from "react";
import {
  HomeIcon as HomeIconOutline,
  BookmarkSquareIcon as BookmarkSquareIconOutline,
  Cog6ToothIcon as Cog6ToothIconOutline,
  PlusCircleIcon as PlusCircleIconOutline,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeIconSolid,
  BookmarkSquareIcon as BookmarkSquareIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
  PlusCircleIcon as PlusCircleIconSolid,
} from "@heroicons/react/24/solid";
import CustomButton from "@components/common/Button/CustomButton";
import { useTranslation } from "react-i18next";
import LOCAL_STORAGE_KEYS from "@utils/constants/LocalStorageKeys";

const MAP_NAVIGATION_BUTTON_STATE = {
  HOME: "home",
  DEFAULT: "map",
  BOOKMARK: "bookmark",
  SETTING: "setting",
  ADD_TOILET: "add-toilet",
};

const MapNavigationBar = ({
  buttonState,
  onHomeBtnClick,
  onBookmarkBtnClick,
  onAddToiletBtnClick,
  onMapSettingBtnClick,
  isNavigationVisible,
}) => {
  const { t } = useTranslation();

  const currentTheme =
    localStorage.getItem(LOCAL_STORAGE_KEYS.THEME) || "light";

  return (
    <div
      className={`absolute flex flex-row justify-center pt-1.5 w-full z-50 ${
        isNavigationVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      } bottom-0 bg-s1 rounded-t-2xl transition-opacity duration-300`}
    >
      <div className="w-1/4">
        <CustomButton
          type="button"
          style="map-home-btn"
          varient={
            buttonState === MAP_NAVIGATION_BUTTON_STATE.HOME
              ? "border-gray-heavy opacity-100"
              : "border-gray-light-semi opacity-50 hover:border-s3"
          }
          icon={
            buttonState === MAP_NAVIGATION_BUTTON_STATE.HOME ? (
              <HomeIconSolid className="size-5 text-text" />
            ) : (
              <HomeIconOutline className="size-5 text-s7" />
            )
          }
          text={t("map_page.navigation.home")}
          textInRow={false}
          textStyles={`${
            buttonState === MAP_NAVIGATION_BUTTON_STATE.HOME
              ? "text-text"
              : "text-s9"
          } tracking-wide text-sm md:text-base`}
          onClick={onHomeBtnClick}
        />
      </div>

      <div className="w-1/4">
        <CustomButton
          type="button"
          style="map-bookmark-btn"
          varient={`${
            buttonState === MAP_NAVIGATION_BUTTON_STATE.BOOKMARK
              ? "border-gray-heavy opacity-100"
              : "border-gray-light-semi opacity-50 hover:border-s3"
          }`}
          icon={
            buttonState === MAP_NAVIGATION_BUTTON_STATE.BOOKMARK ? (
              <BookmarkSquareIconSolid className="size-5 text-text" />
            ) : (
              <BookmarkSquareIconOutline className="size-5 text-s7" />
            )
          }
          text={t("map_page.navigation.bookmarks")}
          textInRow={false}
          textStyles={`${
            buttonState === MAP_NAVIGATION_BUTTON_STATE.BOOKMARK
              ? "text-text"
              : "text-s9"
          } tracking-wide text-sm md:text-base`}
          onClick={onBookmarkBtnClick}
        />
      </div>
      <div className="w-1/4">
        <CustomButton
          type="button"
          style="map-add-toilet-btn"
          varient={
            buttonState === MAP_NAVIGATION_BUTTON_STATE.ADD_TOILET
              ? "border-gray-heavy opacity-100"
              : "border-gray-light-semi opacity-50 hover:border-s3"
          }
          icon={
            buttonState === MAP_NAVIGATION_BUTTON_STATE.ADD_TOILET ? (
              <PlusCircleIconSolid className="size-5 text-text" />
            ) : (
              <PlusCircleIconOutline className="size-5 text-s7" />
            )
          }
          text={t("map_page.navigation.add_toilet")}
          textInRow={false}
          textStyles={`${
            buttonState === MAP_NAVIGATION_BUTTON_STATE.ADD_TOILET
              ? "text-text"
              : "text-s9"
          } tracking-wide text-sm md:text-base`}
          onClick={onAddToiletBtnClick}
        />
      </div>
      <div className="w-1/4">
        <CustomButton
          type="button"
          style="map-setting-btn"
          varient={
            buttonState === MAP_NAVIGATION_BUTTON_STATE.SETTING
              ? "border-gray-heavy opacity-100"
              : "border-gray-light-semi opacity-50 hover:border-s3"
          }
          icon={
            buttonState === MAP_NAVIGATION_BUTTON_STATE.SETTING ? (
              <Cog6ToothIconSolid className="size-5 text-text" />
            ) : (
              <Cog6ToothIconOutline className="size-5 text-s7" />
            )
          }
          text={t("map_page.navigation.settings")}
          textInRow={false}
          textStyles={`${
            buttonState === MAP_NAVIGATION_BUTTON_STATE.SETTING
              ? "text-text"
              : "text-s9"
          } tracking-wide text-sm md:text-base`}
          onClick={onMapSettingBtnClick}
        />
      </div>
    </div>
  );
};

export default MapNavigationBar;
