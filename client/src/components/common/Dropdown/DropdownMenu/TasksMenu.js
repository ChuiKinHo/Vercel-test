import { useTranslation } from "react-i18next";

const useTasksMenu = () => {
  const { t } = useTranslation();

  return {
    daily: {
      name: t("rewards_page.dropdown.daily"),
      value: "daily",
    },
    weekly: {
      name: t("rewards_page.dropdown.weekly"),
      value: "weekly",
    },
    monthly: {
      name: t("rewards_page.dropdown.monthly"),
      value: "monthly",
    },
    yearly: {
      name: t("rewards_page.dropdown.yearly"),
      value: "yearly",
    },
    "one-time": {
      name: t("rewards_page.dropdown.one-time"),
      value: "one-time",
    },
  };
};

export default useTasksMenu;
