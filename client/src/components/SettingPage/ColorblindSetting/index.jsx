import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import useColorblindMenu from "@components/common/ListGroup/ListGroupMenu/ColorblindMenu";
import ChangeColorblindModal from "../Modals/ChangeColorblindModal";

const ColorblindSetting = ({ userData }) => {
  const { t } = useTranslation();
  const ColorblindMenu = useColorblindMenu();

  const [openChangeColorblindModal, setOpenChangeColorblindModal] = useState(false);
  const [userPreferenceColorblind, setUserPreferenceColorblind] = useState("");

  useEffect(() => {
    if (userData) {
      Object.entries(ColorblindMenu).map(([key, data]) => {
        if (userData.preference_colorblind === key) {
          setUserPreferenceColorblind(data.name);
        }
      });
    }
  }, [userData]);

  return (
    <div className="mt-3 md:mt-9">
      <div
        role="button"
        onClick={() => setOpenChangeColorblindModal(true)}
        className="px-8 md:px-12 py-2.5 md:py-4 rounded-xl bg-s2"
      >
        <div className="flex gap-x-5 items-center">
          <h2 className="text-text text-sm md:text-xl font-bold w-full">
            {t("setting_page.colorblind_setting.title")}
          </h2>
          <div className="flex justify-end w-full">
            <p className="text-text text-xs md:text-lg font-medium text-s5 opacity-30">
              {userPreferenceColorblind}
            </p>
          </div>
        </div>
      </div>
      {openChangeColorblindModal && (
        <ChangeColorblindModal
          onCloseModal={() => setOpenChangeColorblindModal(false)}
          userData={userData}
        />
      )}
    </div>
  );
};

export default ColorblindSetting;
