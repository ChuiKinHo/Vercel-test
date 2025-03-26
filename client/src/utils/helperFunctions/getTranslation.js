import i18next from "i18next";

export const findKeyByValue = (obj, targetValue, currentPath = "") => {
  for (const key in obj) {
    const newPath = currentPath ? `${currentPath}.${key}` : key;

    if (typeof obj[key] === "object") {
      const result = findKeyByValue(obj[key], targetValue, newPath);
      if (result) return result;
    } else if (obj[key] === targetValue) {
      return newPath;
    }
  }
  return null;
};

export const translateByValue = (sourceLanguage, targetLanguage, value) => {
  const sourceData =
    i18next.getDataByLanguage(sourceLanguage)?.translation || {};
  const targetData =
    i18next.getDataByLanguage(targetLanguage)?.translation || {};

  const keyPath = findKeyByValue(sourceData, value);
  if (!keyPath) return null;

  return keyPath.split(".").reduce((acc, key) => acc?.[key], targetData);
};
