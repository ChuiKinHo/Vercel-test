import { useTranslation } from "react-i18next";
import { LiaRestroomSolid } from "react-icons/lia";
import { PiToilet } from "react-icons/pi";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { IoRestaurantOutline } from "react-icons/io5";

const useTypeOfToiletMenu = () => {
  const { t } = useTranslation();

  return {
    public: {
      name: t("common_phases.list_group.type_of_toilet.public"),
      value: "public",
      icon: <LiaRestroomSolid className="size-5" />,
    },
    private: {
      name: t("common_phases.list_group.type_of_toilet.private"),
      value: "private",
      icon: <PiToilet className="size-5" />,
    },
    shopping_plaza: {
      name: t("common_phases.list_group.type_of_toilet.shopping_plaza"),
      value: "shopping_plaza",
      icon: <HiOutlineShoppingBag className="size-5" />,
    },
    restaurant: {
      name: t("common_phases.list_group.type_of_toilet.restaurant"),
      value: "restaurant",
      icon: <IoRestaurantOutline className="size-5" />,
    },
  };
};

export default useTypeOfToiletMenu;
