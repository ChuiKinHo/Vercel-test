import { TOILET_TOGGLE_STATES } from "./ToggleStates";

const CustomToggleButton = ({
  toggleState = TOILET_TOGGLE_STATES[0],
  onToggled,
}) => {
  const handleToggle = (e) => {
    e.stopPropagation();

    if (onToggled) {
      onToggled();
    }
  };

  return (
    <button
      className={`w-[70px] h-7 flex items-center rounded-full p-1 transition-colors ${
        toggleState === "true"
          ? "bg-url"
          : toggleState === "false"
          ? "bg-red-500"
          : "bg-s3"
      }`}
      onClick={handleToggle}
      type="button"
    >
      <div
        className={`w-6 h-6 bg-s2 rounded-full shadow-md transform transition-transform ${
          toggleState === "true"
            ? "translate-x-5"
            : toggleState === "false"
            ? "translate-x-9"
            : "translate-x-0"
        }`}
      ></div>
    </button>
  );
};

export default CustomToggleButton;
