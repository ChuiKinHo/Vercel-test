import { useTranslation } from "react-i18next";

const useDistrictMenu = () => {
  const { t } = useTranslation();

  return {
    "Central & Western": {
      name: t("hong_kong_address_components.district.central_&_western"),
      area: t("hong_kong_address_components.area.hong_kong_island"),
    },
    "Wan Chai": {
      name: t("hong_kong_address_components.district.wan_chai"),
      area: t("hong_kong_address_components.area.hong_kong_island"),
    },
    Eastern: {
      name: t("hong_kong_address_components.district.eastern"),
      area: t("hong_kong_address_components.area.hong_kong_island"),
    },
    Southern: {
      name: t("hong_kong_address_components.district.southern"),
      area: t("hong_kong_address_components.area.hong_kong_island"),
    },
    "Yau Tsim Mong": {
      name: t("hong_kong_address_components.district.yau_tsim_mong"),
      area: t("hong_kong_address_components.area.kowloon"),
    },
    "Sham Shui Po": {
      name: t("hong_kong_address_components.district.sham_shui_po"),
      area: t("hong_kong_address_components.area.kowloon"),
    },
    "Kowloon City": {
      name: t("hong_kong_address_components.district.kowloon_city"),
      area: t("hong_kong_address_components.area.kowloon"),
    },
    "Wong Tai Sin": {
      name: t("hong_kong_address_components.district.wong_tai_sin"),
      area: t("hong_kong_address_components.area.kowloon"),
    },
    "Kwun Tong": {
      name: t("hong_kong_address_components.district.kwun_tong"),
      area: t("hong_kong_address_components.area.kowloon"),
    },
    "Kwai Tsing": {
      name: t("hong_kong_address_components.district.kwai_tsing"),
      area: t("hong_kong_address_components.area.new_territories"),
    },
    "Tsuen Wan": {
      name: t("hong_kong_address_components.district.tsuen_wan"),
      area: t("hong_kong_address_components.area.new_territories"),
    },
    "Tuen Mun": {
      name: t("hong_kong_address_components.district.tuen_mun"),
      area: t("hong_kong_address_components.area.new_territories"),
    },
    "Yuen Long": {
      name: t("hong_kong_address_components.district.yuen_long"),
      area: t("hong_kong_address_components.area.new_territories"),
    },
    North: {
      name: t("hong_kong_address_components.district.north"),
      area: t("hong_kong_address_components.area.new_territories"),
    },
    "Tai Po": {
      name: t("hong_kong_address_components.district.tai_po"),
      area: t("hong_kong_address_components.area.new_territories"),
    },
    "Sha Tin": {
      name: t("hong_kong_address_components.district.sha_tin"),
      area: t("hong_kong_address_components.area.new_territories"),
    },
    "Sai Kung": {
      name: t("hong_kong_address_components.district.sai_kung"),
      area: t("hong_kong_address_components.area.new_territories"),
    },
    Islands: {
      name: t("hong_kong_address_components.district.islands"),
      area: t("hong_kong_address_components.area.new_territories"),
    },
    Others: {
      name: t("hong_kong_address_components.district.others"),
      area: t("hong_kong_address_components.area.others"),
    },
  };
};

export default useDistrictMenu;
