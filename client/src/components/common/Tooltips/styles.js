const defaultStyle = `absolute px-3 py-2 hidden group-hover:flex items-center justify-center bg-s8 rounded shadow-lg shadow-shadow`;

const styles = {
  default: `${defaultStyle}`,
};

const placementStyles = {
  top: "bottom-full",
  bottom: "top-full",
  left: "right-full",
  right: "left-full",
};

const arrowDirectionStyles = {
  top: "left-1/2 -translate-x-1/2 -top-1",
  bottom: "left-1/2 -translate-x-1/2 -bottom-1",
  left: "top-1/2 -translate-y-1/2 -left-1",
  right: "top-1/2 -translate-y-1/2 -right-1",
};

export { styles, placementStyles, arrowDirectionStyles };
