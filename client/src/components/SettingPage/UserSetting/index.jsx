import CustomAvatar from "@components/common/Avatar/Avatar";
import CustomListGroup from "@components/common/ListGroup/CustomListGroup";
import useUserSettingMenu from "@components/common/ListGroup/ListGroupMenu/UserSettingMenu";
import { useState } from "react";
import ChangePasswordModal from "../Modals/ChangePasswordModal";
import ChangeEmailModal from "../Modals/ChangeEmailModal";

const UserSetting = ({ userData, isGuestUser }) => {
  const UserSettingMenu = useUserSettingMenu();

  const [openChangeEmailModal, setOpenChangeEmailModal] = useState(false);
  const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false);

  const onMenuItemSelected = (data) => {
    switch (data.value) {
      case "change_password":
        setOpenChangePasswordModal(true);
        setOpenChangeEmailModal(false);
        break;

      case "change_email":
        setOpenChangeEmailModal(true);
        setOpenChangePasswordModal(false);
        break;

      default:
        setOpenChangeEmailModal(false);
        setOpenChangePasswordModal(false);
    }
  };

  return (
    <div className="mt-3 md:mt-9">
      <div className="flex flex-col gap-y-7 px-8 md:px-12 py-7 md:py-9 rounded-xl bg-s2 ">
        <div className="flex flex-col md:flex-row gap-y-5 md:gap-x-7 md:gap-x-16 items-center">
          <CustomAvatar src={userData?.userAvatar} varient="size-36" />
          <div className="flex flex-col gap-y-1 items-center md:items-start justify-center">
            <p className="max-w-[230px] text-text md:max-w-full h-fit break-words text-center text-xl font-semibold">
              {userData?.fullname}
            </p>
            <p className="max-w-[150px] text-text md:max-w-full h-fit break-words text-center text-sm md:text-lg font-medium">
              {userData?.username}
            </p>
            {!isGuestUser && (
              <p className="mt-5 text-xs md:text-sm font-semibold text-text opacity-40">
                {userData?.email}
              </p>
            )}
          </div>
        </div>

        {!isGuestUser && (
          <CustomListGroup
            textStyle="text-start text-sm md:text-sm font-semibold"
            listGroupMenu={UserSettingMenu}
            onMenuItemSelected={onMenuItemSelected}
          />
        )}
      </div>
      {openChangePasswordModal && (
        <ChangePasswordModal
          onCloseModal={() => setOpenChangePasswordModal(false)}
        />
      )}
      {openChangeEmailModal && (
        <ChangeEmailModal
          userData={userData}
          onCloseModal={() => setOpenChangeEmailModal(false)}
        />
      )}
    </div>
  );
};

export default UserSetting;
