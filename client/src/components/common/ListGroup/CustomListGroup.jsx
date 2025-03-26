import { styles } from "./styles";

const CustomListGroup = ({
  style = "default",
  varient,
  listGroupMenu,
  onMenuItemSelected,
  textStyle,
  selectedData,
}) => {
  return (
    <ul className={`${styles[style]} ${varient}`}>
      {listGroupMenu &&
        Object.entries(listGroupMenu).map(([key, data]) => (
          <li
            key={key}
            className="pl-3 pr-2 py-2 cursor-pointer border-b border-s3"
            onClick={() => onMenuItemSelected(data)}
          >
            <div className="flex gap-x-5">
              <span
                className={`${textStyle} ${
                  selectedData === data?.name ? "text-url" : "text-text"
                }`}
              >
                {data?.icon}
              </span>

              <span
                className={`${textStyle} ${
                  selectedData === data?.name ? "text-url" : "text-text"
                }`}
              >
                {data?.name}
              </span>
            </div>
          </li>
        ))}
    </ul>
  );
};

export default CustomListGroup;
