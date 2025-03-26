import { styles, arrowDirectionStyles, placementStyles } from "./styles";

const CustomTooltip = ({ text, textStyle, style="default", varient, placement = "bottom", arrowDirection="top" }) => {
  return (
    <div
      className={`${styles[style]} ${placementStyles[placement]} ${varient} w-max max-w-[100px]`}
    >
      <span className={`${textStyle}`}>{text}</span>
      <div className={`absolute size-3 bg-s8 rotate-45 ${arrowDirectionStyles[arrowDirection]}`}></div>
    </div>
  );
};

export default CustomTooltip;
