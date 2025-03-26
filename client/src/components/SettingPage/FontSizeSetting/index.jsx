import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import useFontSizeMenu from "@components/common/ListGroup/ListGroupMenu/FontSizeMenu";
import ChangeFontSizeModal from "../Modals/ChangeFontSizeModal";

const FontSizeSetting = ({ userData }) => {
  const { t } = useTranslation();
  const FontSizeMenu = useFontSizeMenu();

  const [openChangeFontSizeModal, setOpenChangeFontSizeModal] = useState(false);
  const [userPreferenceFontSize, setUserPreferenceFontSize] = useState("");

  useEffect(() => {
    if (userData) {
      Object.entries(FontSizeMenu).map(([key, data]) => {
        if (userData.preference_font_size === key) {
          setUserPreferenceFontSize(data.name);
        }
      });
    }
  }, [userData]);

  return (
    <div className="mt-3 md:mt-9">
      <div
        role="button"
        onClick={() => setOpenChangeFontSizeModal(true)}
        className="px-8 md:px-12 py-2.5 md:py-4 rounded-xl bg-s2"
      >
        <div className="flex gap-x-5 items-center">
          <h2 className="text-text text-sm md:text-xl font-bold w-full">
            {t("setting_page.font_size_setting.title")}
          </h2>
          <div className="flex justify-end w-full">
            <p className="text-text text-xs md:text-lg font-medium text-s5 opacity-30">
              {userPreferenceFontSize}
            </p>
          </div>
        </div>
      </div>
      {openChangeFontSizeModal && (
        <ChangeFontSizeModal
          onCloseModal={() => setOpenChangeFontSizeModal(false)}
          userData={userData}
        />
      )}
    </div>
  );
};

export default FontSizeSetting;
