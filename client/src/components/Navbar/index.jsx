"use client";

import { useState } from "react";
import { ListBulletIcon } from "@heroicons/react/24/outline";
import CustomButton from "@components/common/Button/CustomButton";
import NavbarItems from "./Items/Items";
import CustomAvatar from "@components/common/Avatar/Avatar";

const NavigationBar = ({ userData, isAdmin }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="bg-s7 min-h-screen rounded-lg">
      <div className="m-3">
        <CustomButton
          onClick={toggleNavbar}
          icon={<ListBulletIcon className="size-5 md:size-8 text-s3" />}
          style="navigation-bar-toggle-btn"
          varient="p-1"
        />
      </div>

      <div
        className={`${
          isOpen
            ? "md:w-52 h-[90vh] opacity-100 md:opacity-100"
            : "md:w-0 h-0 opacity-0"
        } 
          mt-1 md:mt-0 flex flex-col transition-y md:transition-x duration-700 overflow-hidden`}
      >
        <nav className="flex flex-col gap-6 md:gap-8 items-center flex-grow">
          <CustomAvatar
            src={userData?.userAvatar}
            alt="Navbar User Avatar"
            varient="size-9 md:size-28"
          />
          <NavbarItems userData={userData} isAdmin={isAdmin} />
        </nav>
      </div>
    </div>
  );
};

export default NavigationBar;
