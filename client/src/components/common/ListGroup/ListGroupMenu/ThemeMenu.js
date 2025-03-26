import { useTranslation } from "react-i18next";
import { MdDarkMode } from "react-icons/md";
import { CiBrightnessUp } from "react-icons/ci";

const useThemeMenu = () => {
  const { t } = useTranslation();

  return {
    light: {
      name: t("common_phases.list_group.theme.light"),
      value: "light",
      icon: <CiBrightnessUp className="size-5" />,
    },
    dark: {
      name: t("common_phases.list_group.theme.dark"),
      value: "dark",
      icon: <MdDarkMode className="size-5" />,
    },
    dark1: {
      name: t("common_phases.list_group.theme.dark1"),
      value: "dark1",
      icon: <MdDarkMode className="size-5" />,
    },
    dark2: {
      name: t("common_phases.list_group.theme.dark2"),
      value: "dark2",
      icon: <MdDarkMode className="size-5" />,
    },
  };
};

export default useThemeMenu;
