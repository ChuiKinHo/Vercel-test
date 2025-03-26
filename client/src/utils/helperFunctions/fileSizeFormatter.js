const fileSizeFormatter = (fileSize) => {
  if (fileSize === 0) {
    return "0 Bytes";
  }

  const units = ["Bytes", "KB", "MB", "GB", "TB"];
  const base = 1024;
  const decimalPlaces = 1;

  const sizeIndex = Math.floor(Math.log(fileSize) / Math.log(base));
  const size = (fileSize / Math.pow(base, sizeIndex)).toFixed(decimalPlaces);

  return `${size} ${units[sizeIndex]}`;
};

export default fileSizeFormatter;
