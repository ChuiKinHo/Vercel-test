"use client";

import withAuth from "@layout/ProtectedRoutes/withAuth";
import SettingLayout from "@components/SettingPage/Layout";
import LanguageSetting from "@components/SettingPage/LanguageSetting";
import UserSetting from "@components/SettingPage/UserSetting";
import FontSizeSetting from "@components/SettingPage/FontSizeSetting";
import ThemeSetting from "@components/SettingPage/ThemeSetting";
import ColorblindSetting from "@components/SettingPage/ColorblindSetting";

const SettingPage = ({ userData, isGuestUser }) => {
  return (
    <SettingLayout userData={userData}>
      <div>
        <UserSetting userData={userData} isGuestUser={isGuestUser} />
        <LanguageSetting userData={userData} />
        <FontSizeSetting userData={userData} />
        <ThemeSetting userData={userData} />
        <ColorblindSetting userData={userData} />
      </div>
      {/* <div class="text-text">Color for normal text</div>
      <div class="text-url">Color for url</div>
      <div class="text-redd">Color for warning</div>
      <div class="text-blue-lightt">Color for light blue</div>
      <div class="text-greenn">Color for url</div> */}
    </SettingLayout>
  );
};

export default withAuth(SettingPage);
