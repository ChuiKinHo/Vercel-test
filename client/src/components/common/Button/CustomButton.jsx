import React from "react";
import { styles } from "./styles";
import Spinner from "../Spinner/Spinner";

const CustomButton = ({
  type = "button",
  disabled,
  style = "default",
  textStyles = "",
  varient = "",
  text = "",
  textInRow = true,
  icon,
  loading,
  spinner,
  spinnerStyle,
  tooltip,
  indicator,
  indicatorData = 0,
  onClick,
}) => {
  const renderContent = () => {
    if (icon) {
      return (
        <div
          className={`flex text-s7 ${textInRow ? "flex-row-reverse gap-x-2" : "flex-col gap-y-1" } justify-center items-center `}
        >
          <div className="relative group">
            {icon}
            {tooltip}
          </div>

          {indicator && indicatorData > 0 && indicatorData && (
            <div
              className="absolute -top-1.5 -right-0.5 flex justify-center items-center rounded-full 
                            size-4 border-2 border-transparent bg-red-400 hover:bg-red-500"
            >
              <p className="text-white profile-notif font-semibold leading-tight">
                {indicatorData > 9 ? "9+" : indicatorData}
              </p>
            </div>
          )}
          {text && <div className={`${textStyles}`}>{text}</div>}
        </div>
      );
    } else {
      if (text) {
        return (
          <div className="flex flex-row justify-center items-center gap-x-2">
            {text && <div className={`${textStyles}`}>{text}</div>}
            {loading && spinner && <Spinner style={spinnerStyle} />}
          </div>
        );
      }
    }
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${styles[style]} ${varient}`}
      onClick={onClick}
    >
      {renderContent()}
    </button>
  );
};

export default CustomButton;
