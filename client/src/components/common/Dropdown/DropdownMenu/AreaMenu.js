import { useTranslation } from "react-i18next";

const useAreaMenu = () => {
  const { t } = useTranslation();

  return {
    Kowloon: {
      name: t("hong_kong_address_components.area.kowloon"),
    },
    "New Territories": {
      name: t("hong_kong_address_components.area.new_territories"),
    },
    "Hong Kong Island": {
      name: t("hong_kong_address_components.area.hong_kong_island"),
    },
    Others: {
      name: t("hong_kong_address_components.area.others"),
    },
  };
};

export default useAreaMenu;
