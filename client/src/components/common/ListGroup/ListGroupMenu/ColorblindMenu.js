import { useTranslation } from "react-i18next";
import { MdDarkMode } from "react-icons/md";
import { CiBrightnessUp } from "react-icons/ci";

const useThemeMenu = () => {
  const { t } = useTranslation();

  return {
    default: {
      name: t("common_phases.list_group.colorblind.default"),
      value: "default",
      icon: <CiBrightnessUp className="size-5" />,
    },
    protanopia: {
      name: t("common_phases.list_group.colorblind.protanopia"),
      value: "protanopia",
      icon: <CiBrightnessUp className="size-5" />,
    },
    deuteranopia: {
      name: t("common_phases.list_group.colorblind.deuteranopia"),
      value: "deuteranopia",
      icon: <MdDarkMode className="size-5" />,
    },
    tritanopia: {
      name: t("common_phases.list_group.colorblind.tritanopia"),
      value: "tritanopia",
      icon: <MdDarkMode className="size-5" />,
    },
    achromatopsia: {
      name: t("common_phases.list_group.colorblind.achromatopsia"),
      value: "achromatopsia",
      icon: <MdDarkMode className="size-5" />,
    },
  };
};

export default useThemeMenu;
