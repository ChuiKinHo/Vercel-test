import { styles } from "./styles";

const CustomAvatar = ({ src, alt = "", style = "default", varient }) => {
  return <img src={src} alt={alt} className={`${styles[style]} ${varient}`} />;
};

export default CustomAvatar;
