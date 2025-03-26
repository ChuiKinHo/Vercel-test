import { useTranslation } from "react-i18next";

const useRewardsMenu = () => {
  const { t } = useTranslation();

  return {
    all: {
      name: t("rewards_page.dropdown.all"),
      value: "all"
    },
    coupon: {
      name: t("rewards_page.dropdown.coupon"),
      value: "coupon"
    },
    souvenir: {
      name: t("rewards_page.dropdown.souvenir"),
      value: "souvenir"
    },
  };
};

export default useRewardsMenu;
