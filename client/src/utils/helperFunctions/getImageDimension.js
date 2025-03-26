const acceptMimeTypes = [
  "image/png",
  "image/jpeg",
  "image/svg+xml",
  "image/webp",
];

const getImageDimension = (file) => {
  return new Promise((resolve, reject) => {
    if (file && acceptMimeTypes.includes(file.type)) {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };

      img.onerror = () => {
        reject(null);
      };
    } else {
      reject(null);
    }
  });
};

export default getImageDimension;
