import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import useLanguageMenu from "@components/common/ListGroup/ListGroupMenu/LanguageMenu";
import ChangeLanguageModal from "../Modals/ChangeLanguageModal";

const LanguageSetting = ({ userData }) => {
  const { t } = useTranslation();
  const LanguageMenu = useLanguageMenu();

  const [openChangeLanguageModal, setOpenChangeLanguageModal] = useState(false);
  const [userPreferenceLanguage, setUserPreferenceLanguage] = useState("");

  useEffect(() => {
    if (userData) {
      Object.entries(LanguageMenu).map(([key, data]) => {
        if (userData.preference_language === key) {
          setUserPreferenceLanguage(data.name);
        }
      });
    }
  }, [userData]);

  return (
    <div className="mt-3 md:mt-9">
      <div
        role="button"
        onClick={() => setOpenChangeLanguageModal(true)}
        className="px-8 md:px-12 py-2.5 md:py-4 rounded-xl bg-s2"
      >
        <div className="flex gap-x-5 items-center">
          <h2 className="text-text text-sm md:text-xl font-bold w-full">
            {t("setting_page.language_setting.title")}
          </h2>
          <div className="flex justify-end w-full">
            <p className="text-text text-xs md:text-lg font-medium text-s5 opacity-30">
              {userPreferenceLanguage}
            </p>
          </div>
        </div>
      </div>
      {openChangeLanguageModal && (
        <ChangeLanguageModal
          onCloseModal={() => setOpenChangeLanguageModal(false)}
          userData={userData}
        />
      )}
    </div>
  );
};

export default LanguageSetting;
