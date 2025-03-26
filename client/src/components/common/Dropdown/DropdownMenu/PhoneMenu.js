import { useTranslation } from "react-i18next";

const usePhoneMenu = () => {
  const { t } = useTranslation();

  return {
    hk: {
      name: t("common_phases.dropdown.phone.hong_kong"),
      code: "852",
      icon: <img src="/countries/hk.svg" className="size-5"></img>,
      requiredLength: 8,
    },
    mo: {
      name: t("common_phases.dropdown.phone.macau"),
      code: "853",
      icon: <img src="/countries/mo.svg" className="size-5"></img>,
      requiredLength: 8,
    },
    cn: {
      name: t("common_phases.dropdown.phone.china"),
      code: "86",
      icon: <img src="/countries/cn.svg" className="size-5"></img>,
      requiredLength: 11,
    },
    tw: {
      name: t("common_phases.dropdown.phone.taiwan"),
      code: "886",
      icon: <img src="/countries/tw.svg" className="size-5"></img>,
      requiredLength: 9,
    },
  };
};

export default usePhoneMenu;
