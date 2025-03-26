import { saveAs } from "file-saver";

const mimeTypesMapping = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/svg+xml": "svg",
  "image/webp": "webp",
  "video/mp4": "mp4",
  "video/webm": "webm",
};

const downloadFile = async ({ link, filename }) => {
  try {
    const response = await fetch(link);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${link}`);
    }

    const mimeType = response.headers.get("Content-Type").split(";")[0];
    const fileType = mimeTypesMapping[mimeType];

    const blob = await response.blob();

    saveAs(blob, `${filename}.${fileType}`);
  } catch (error) {
    console.error("Error downloading file:", error);
  }
};

export default downloadFile;
