import {
  MagnifyingGlassIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import { useRef } from "react";
import CustomButton from "../Button/CustomButton";
import CustomInputField from "../InputFiled/CustomInputField";
import { styles } from "./styles";

const CustomSearchBar = ({
  onChange,
  onKeyDown,
  onReset,
  placeholder = "",
  style = "default",
  enableFilter = false,
  filterModal,
  setOpenFilterModal,
  openFilterModal,
}) => {
  const inputRef = useRef(null);

  const resetInput = () => {
    if (inputRef) {
      inputRef.current.value = "";
      if (onReset) {
        onReset();
      }
    }
  };

  return (
    <div className={`flex flex-row gap-x-4 items-center ${styles[style]}`}>
      <MagnifyingGlassIcon className="size-6 text-s5" />

      <div className="grow">
        <CustomInputField
          ref={inputRef}
          placeholder={placeholder}
          style="search-bar-default"
          varient="text-s4"
          onChange={onChange}
          onKeyDown={onKeyDown}
        />
      </div>

      {!!inputRef?.current?.value && (
        <CustomButton
          icon={<XMarkIcon className="size-5 text-s5" />}
          onClick={resetInput}
          style="search-bar-reset-button"
        />
      )}

      {enableFilter && (
        <CustomButton
          icon={<AdjustmentsHorizontalIcon className="size-5 text-s5" />}
          onClick={() => setOpenFilterModal(true)}
          style="search-bar-filter-btn"
        />
      )}

      {openFilterModal && filterModal}
    </div>
  );
};

export default CustomSearchBar;
