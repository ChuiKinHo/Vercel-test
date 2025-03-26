import React from "react";
import { icons } from "./icons";

const FontAwesomeIcons = ({ icon = "default", style = "", onClick, type }) => {
  switch (type) {
    case "icon":
      return (
        <div className={`${style}`}>
          <i className={`${icons[icon]}`}></i>
        </div>
      );
    case "button":
      return (
        <div className={`${style}`}>
          <button
            type="button"
            className={`${icons[icon]}`}
            onClick={onClick}
          ></button>
        </div>
      );
    default:
      return (
        <div className={`${style}`}>
          <button
            type="button"
            className={`${icons[icon]}`}
            onClick={onClick}
          ></button>
        </div>
      );
  }
};

export default FontAwesomeIcons;
