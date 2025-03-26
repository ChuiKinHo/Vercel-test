import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import CustomSlider from "@components/common/Slider/CustomSlider";
import drawNearbyCircle from "@utils/helperFunctions/map/drawNearbyCircle";
import useLanguageMenu from "@components/common/ListGroup/ListGroupMenu/LanguageMenu";
import ChangeLanguageModal from "@components/MapPage/Modals/ChangeLanguageModal";
import MarkerCustomizationModal from "@components/MapPage/Modals/MarkerCustomizationModal";
import LoginRequiredModal from "../Modals/LoginRequiredModal";

const MapSettingDrawerContent = ({
  userData,
  setNearbyCircleRadius,
  initialNearbyCircleRadius,
  mapRef,
  longitude,
  latitude,
  is3DModeEnabled,
  updateMapLanguage,
}) => {
  const { t } = useTranslation();
  const LanguageMenu = useLanguageMenu();

  const [openChangeLanguageModal, setOpenChangeLanguageModal] = useState(false);
  const [openMarkerCustomizationModal, setOpenMarkerCustomizationModal] =
    useState(false);
  const [showLoginRequiredModal, setShowLoginRequiredModal] = useState(false);

  const [userPreferenceLanguage, setUserPreferenceLanguage] = useState(
    LanguageMenu.en_us.name
  );

  useEffect(() => {
    if (userData) {
      Object.entries(LanguageMenu).map(([key, data]) => {
        if (userData.preference_language === key) {
          setUserPreferenceLanguage(data.name);
        }
      });
    }
  }, [userData]);

  const onRadiusChange = (newRadius) => {
    setNearbyCircleRadius(newRadius);

    mapRef?.current?.flyTo({
      center: [longitude, latitude],
      zoom: newRadius >= 500 ? (newRadius >= 800 ? 14 : 15) : 16,
      speed: 1.7,
    });

    drawNearbyCircle({
      mapRef,
      longitude,
      latitude,
      nearbyCircleRadius: newRadius,
      is3DModeEnabled,
    });
  };

  return (
    <div className="w-full rounded-lg">
      <p className="text-center font-bold text-2xl">
        {t("map_page.drawer.settings")}
      </p>

      <div className="mt-6 flex flex-col gap-y-5">
        <div className="p-6 flex flex-col gap-y-3.5 bg-s2 rounded-xl">
          <p className="font-bold text-text">
            {t("map_page.drawer.nearby_circle_radius")}
          </p>
          <CustomSlider
            min={300}
            max={1000}
            step={50}
            unit={t("map_page.drawer.m")}
            initialValue={initialNearbyCircleRadius}
            onValueChange={onRadiusChange}
          />
        </div>

        <div
          role="button"
          className="p-4 flex bg-s2 rounded-lg"
          onClick={() => {
            if (userData) {
              setOpenMarkerCustomizationModal(true);
            } else {
              setShowLoginRequiredModal(true);
            }
          }}
        >
          <p className="font-bold text-text">
            {t("map_page.drawer.marker_customization")}
          </p>
        </div>

        <div
          role="button"
          className="p-4 flex bg-s2 justify-between rounded-lg w-full"
          onClick={() => setOpenChangeLanguageModal(true)}
        >
          <p className="font-bold text-text">{t("map_page.drawer.language")}</p>

          <p className="text-xs md:text-lg font-medium text-s5 opacity-60">
            {userPreferenceLanguage}
          </p>
        </div>
      </div>

      {openChangeLanguageModal && (
        <ChangeLanguageModal
          onCloseModal={() => setOpenChangeLanguageModal(false)}
          updateMapLanguage={updateMapLanguage}
          userData={userData}
          setUserPreferenceLanguage={setUserPreferenceLanguage}
        />
      )}

      {openMarkerCustomizationModal && (
        <MarkerCustomizationModal
          onCloseModal={() => setOpenMarkerCustomizationModal(false)}
          mapRef={mapRef}
          userData={userData}
        />
      )}

      {showLoginRequiredModal && (
        <LoginRequiredModal
          onCloseModal={() => setShowLoginRequiredModal(false)}
        />
      )}
    </div>
  );
};

export default MapSettingDrawerContent;
