import Link from "next/link";
import FontAwesomeIcons from "@components/common/Icons/FontAwesomeIcons";

const NavbarItem = ({
  href,
  icon,
  text,
  onClick,
  currentURL,
  isLastChild = false,
}) => {
  return (
    <Link
      href={href}
      className={`
        ${isLastChild && "mt-auto mb-6"} 
        ${
          currentURL === href
            ? "translate-x-1 md:translate-x-3 border-s4 border-l-[3px] md:border-l-4 px-3.5 md:px-10"
            : "transition-transform duration-300 hover:translate-x-1 md:hover:translate-x-3"
        } 
        `}
      onClick={onClick}
    >
      <div
        className="flex flex-row gap-2 md:gap-3 items-center text-s3 
        font-semibold text-sm md:text-base"
      >
        <FontAwesomeIcons icon={icon} type="icon" />
        <span className="hidden md:block">{text}</span>
      </div>
    </Link>
  );
};

export default NavbarItem;
