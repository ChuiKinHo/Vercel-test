import React, { createContext, useContext, useEffect, useState } from "react";
import LOCAL_STORAGE_KEYS from "@utils/constants/LocalStorageKeys";

const FontSizeContext = createContext();

const useFontSize = () => useContext(FontSizeContext);

// Font size mappings (S/M/L to px values)
const fontSizeMappings = {
  S: "12px",
  M: "16px", // default
  L: "20px"
};

const FontSizeProvider = ({ children }) => {
  const [fontSize, setFontSize] = useState("M");

  useEffect(() => {
    // Update root font size when fontSize changes
    document.documentElement.style.fontSize = fontSizeMappings[fontSize];
  }, [fontSize]);

  useEffect(() => {
    const currentFontSize =
      localStorage.getItem(LOCAL_STORAGE_KEYS.FONT_SIZE) || "M";
    setFontSize(currentFontSize);
  }, []);

  const changeFontSize = ({ fontSize }) => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.FONT_SIZE, fontSize);
    setFontSize(fontSize);
  };

  return (
    <FontSizeContext.Provider value={{ fontSize, changeFontSize }}>
      {children}
    </FontSizeContext.Provider>
  );
};

export { FontSizeProvider, useFontSize };
