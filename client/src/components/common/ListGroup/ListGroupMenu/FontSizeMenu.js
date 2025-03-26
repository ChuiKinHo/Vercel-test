import { useTranslation } from "react-i18next";

const useFontSizeMenu = () => {
  const { t } = useTranslation();

  return {
    S: {
      name: t("common_phases.list_group.font_size.S"),
      value: "S",
    },
    M: {
      name: t("common_phases.list_group.font_size.M"),
      value: "M",
    },
    L: {
      name: t("common_phases.list_group.font_size.L"),
      value: "L",
    },
  };
};

export default useFontSizeMenu;
