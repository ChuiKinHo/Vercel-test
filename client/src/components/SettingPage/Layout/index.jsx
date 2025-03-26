import React from "react";
import Banner from "@layout/Banner";
import { useTranslation } from "react-i18next";

const SettingLayout = ({ children, userData }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-s1 grow overflow-auto min-h-screen min-w-screen">
      <div className="flex flex-row h-full w-full py-10">
        <Banner userData={userData} isGuest={false} />
        <div className="grow min-w-[350px] md:min-w-[950px] px-8 -ml-1.5">
          <h1 className="pl-0 text-text md:pl-12 text-2xl md:text-4xl font-bold">
            {t("setting_page.title")}
          </h1>
          {children}
        </div>
      </div>
    </div>
  );
};

export default SettingLayout;
