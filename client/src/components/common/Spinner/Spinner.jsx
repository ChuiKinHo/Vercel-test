import React from "react";
import styles from "./styles";

const Spinner = ({ style = "default" }) => {
  return (
    <div className={`${styles[style]}`}></div>
  );
};

export default Spinner;
