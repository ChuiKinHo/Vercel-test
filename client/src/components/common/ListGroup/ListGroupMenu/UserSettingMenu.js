import { useTranslation } from "react-i18next";

const useUserSettingMenu = () => {
  const { t } = useTranslation();

  return {
    change_email: {
      name: t("common_phases.list_group.settings.change_email"),
      value: "change_email",
    },
    change_password: {
      name: t("common_phases.list_group.settings.change_password"),
      value: "change_password",
    },
  };
};

export default useUserSettingMenu;
