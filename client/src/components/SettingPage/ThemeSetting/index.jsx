import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import useThemeMenu from "@components/common/ListGroup/ListGroupMenu/ThemeMenu";
import ChangeThemeModal from "../Modals/ChangeThemeModal";
import { useTheme } from 'next-themes'

const ThemeSetting = ({ userData }) => {
  const { t } = useTranslation();
  const ThemeMenu = useThemeMenu();

  const [openChangeThemeModal, setOpenChangeThemeModal] = useState(false);
  const [userPreferenceTheme, setUserPreferenceTheme] = useState("");

  useEffect(() => {
    if (userData) {
      Object.entries(ThemeMenu).map(([key, data]) => {
        if (userData.preference_theme === key) {
          setUserPreferenceTheme(data.name);
        }
      });
    }
  }, [userData]);

  return (
    <div className="mt-3 md:mt-9">
      <div
        role="button"
        onClick={() => setOpenChangeThemeModal(true)}
        className="px-8 md:px-12 py-2.5 md:py-4 rounded-xl bg-s2"
      >
        <div className="flex gap-x-5 items-center">
          <h2 className="text-text text-sm md:text-xl font-bold w-full">
            {t("setting_page.theme_setting.title")}
          </h2>
          <div className="flex justify-end w-full">
            <p className="text-text text-xs md:text-lg font-medium text-s5 opacity-30">
              {userPreferenceTheme}
            </p>
          </div>
        </div>
      </div>
      {openChangeThemeModal && (
        <ChangeThemeModal
          onCloseModal={() => setOpenChangeThemeModal(false)}
          userData={userData}
        />
      )}
    </div>
  );
};

export default ThemeSetting;
