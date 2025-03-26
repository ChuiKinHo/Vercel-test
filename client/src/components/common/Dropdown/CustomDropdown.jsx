import { useState } from "react";
import { dropdownMenuStyles, dropdownMenuItemStyles } from "./styles";
import CustomButton from "../Button/CustomButton";

const CustomDropdown = ({
  buttonStyle,
  buttonIcon,
  dropdownPosition = "",
  dropdownMenu,
  dropdownMenuStyle = "default",
  dropdownMenuPosition = "left",
  dropdownMenuVarient = "",
  dropdownMenuItemStyle = "default",
  dropdownMenuItemVarient = "",
  onMenuItemSelected,
  menuWidth = "w-full",
  menuHeight = "h-full",
  menuGap = 2,
}) => {
  const [isDropdownTriggered, setIsDropdownTriggered] = useState(false);

  return (
    <div className={`relative ${dropdownPosition}`}>
      <CustomButton
        type="button"
        onClick={() => setIsDropdownTriggered(!isDropdownTriggered)}
        style={buttonStyle}
        icon={buttonIcon}
      />

      {isDropdownTriggered && (
        <div
          className={`absolute mt-${menuGap} rounded-md shadow-lg shadow-md z-10 top-full ${dropdownMenuPosition}-0`}
        >
          <ul
            className={`${menuWidth} ${menuHeight} ${dropdownMenuStyles[dropdownMenuStyle]} ${dropdownMenuVarient}`}
          >
            {dropdownMenu &&
              Object.entries(dropdownMenu).map(([key, data]) => (
                <li
                  key={key}
                  className="pl-3 pr-2 py-2 cursor-pointer hover:bg-s2"
                  onClick={() => {
                    setIsDropdownTriggered(false);
                    onMenuItemSelected(data);
                  }}
                >
                  <div
                    className={`${dropdownMenuItemStyles[dropdownMenuItemStyle]} ${dropdownMenuItemVarient}`}
                  >
                    <span className="text-start text-xs">{`
                    ${data?.name}
                    ${data?.code ? `(+${data.code})` : ""}
                    `}</span>
                    {data?.icon}
                  </div>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
