import CustomButton from "@components/common/Button/CustomButton";
import {
  XMarkIcon,
  MapPinIcon,
} from "@heroicons/react/24/solid";
import LOCAL_STORAGE_KEYS from "@utils/constants/LocalStorageKeys";

const ToiletDetailsPopup = ({ toilet, onRouteClick, onClosePopup }) => {
  const currentLanguage =
    localStorage.getItem(LOCAL_STORAGE_KEYS.LANGUAGE) || "en_us";

  return (
    <div className="w-[300px] pt-7 px-4 pb-4 bg-s1 opacity-90 rounded-lg shadow-md">
      <CustomButton
        type="button"
        style="popup-close-btn"
        varient="absolute top-1 right-1"
        icon={
          <XMarkIcon className="size-4 text-s6 hover:text-s9" />
        }
        onClick={onClosePopup}
      />

      <div className="flex flex-col items-center gap-y-2">
        <p className="text-lg text-center font-semibold text-s8">
          {currentLanguage === "zh_tw" ? toilet.name_zh : toilet.name_en}
        </p>
        <p className="text-sm text-s5 text-center">
          {currentLanguage === "zh_tw" ? toilet.name_zh : toilet.name_en}
        </p>
        <CustomButton
          type="button"
          style="popup-btn"
          text="Route"
          textStyles="font-semibold"
          icon={<MapPinIcon className="size-4 text-s9 hover:text-text" />}
          onClick={onRouteClick}
        />
      </div>
    </div>
  );
};

export default ToiletDetailsPopup;
