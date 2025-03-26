

const dropdownMenuDefaultStyle = "py-1 max-h-[130px] rounded-md bg-s2 overflow-y-auto md:scroll-bar-appearance"
const dropdownMenuItemDefaultStyle = "flex flex-row"

const dropdownMenuStyles = {
    default: `${dropdownMenuDefaultStyle}`,
};

const dropdownMenuItemStyles = {
    default: `${dropdownMenuItemDefaultStyle}`,
    "phone-dropdown-item": "flex flex-row-reverse justify-between",
    "district-dropdown-item": "flex flex-row justify-between",
    "sub-district-dropdown-item": "flex flex-row justify-between",
    "area-dropdown-item": "flex flex-row justify-between",
    "reward-dropdown-item": "flex flex-row justify-between"
}

export { dropdownMenuStyles, dropdownMenuItemStyles };
