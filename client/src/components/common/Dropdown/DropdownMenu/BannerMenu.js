import { PencilIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

const useBannerMenu = () => {
  const { t } = useTranslation();

  return {
    edit: {
      name: t("common_phases.dropdown.banner.edit_banner"),
      icon: <PencilIcon className="size-4" />,
    },
  };
};

export default useBannerMenu;
