import CustomButton from "@components/common/Button/CustomButton";
import { useState, useEffect } from "react";
import { BellIcon as BellIconOutline } from "@heroicons/react/24/outline";
import { BellIcon as BellIconSolid } from "@heroicons/react/24/solid";
import FriendRequests from "./FriendRequests/index";
import FriendAccepts from "./FriendAccepts";
import CoinsAnnouncement from "./CoinsAnnouncement";
import { useTranslation } from "react-i18next";

const Notification = ({ userNotifications }) => {
  const { t } = useTranslation();

  const [isDropdownTriggered, setIsDropdownTriggered] = useState(false);
  const [NotificationNumber, setNotificationNumber] = useState(
    userNotifications?.length
  );

  const [friendRequestList, setFriendRequestList] = useState([]);
  const [friendAcceptList, setFriendAcceptList] = useState([]);
  const [coinsAnnouncementList, setCoinsAnnouncementList] = useState([]);

  useEffect(() => {
    setFriendRequestList(
      userNotifications?.filter(
        (notification) => notification.role === "friend_request"
      )
    );
    setFriendAcceptList(
      userNotifications?.filter(
        (notification) => notification.role === "friend_accept"
      )
    );
    setCoinsAnnouncementList(
      userNotifications?.filter(
        (notification) => notification.role === "coins_announcement"
      )
    );
  }, [userNotifications]);

  useEffect(() => {
    setNotificationNumber(
      friendRequestList?.length +
        friendAcceptList?.length +
        coinsAnnouncementList?.length
    );
  }, [
    userNotifications,
    friendAcceptList,
    friendRequestList,
    coinsAnnouncementList,
  ]);

  return (
    <div className="absolute right-4 top-4">
      <CustomButton
        icon={
          isDropdownTriggered ? (
            <BellIconSolid className="size-6" />
          ) : (
            <BellIconOutline className="size-6" />
          )
        }
        indicator={true}
        indicatorData={NotificationNumber}
        onClick={() => setIsDropdownTriggered(!isDropdownTriggered)}
      />

      {isDropdownTriggered && (
        <div className="absolute top-10 md:top-0 right-3.5 md:right-10 z-10">
          <ul
            className="flex flex-col items-center w-80 md:w-[420px] h-[270px] md:h-[400px] rounded-md shadow-lg shadow-shadow
                        gap-y-4 bg-s2 overflow-y-auto md:scroll-bar-appearance p-4"
          >
            <div className="flex flex-col w-full items-center gap-y-2 -mb-2">
              <p className="font-semibold">{t("notifications.title")}</p>
              <div className="w-full border border-gray-default border-opacity-20"></div>
            </div>
            {friendRequestList && (
              <FriendRequests
                firendRequestList={friendRequestList}
                setFriendRequestList={setFriendRequestList}
              />
            )}
            {friendAcceptList && (
              <FriendAccepts
                friendAcceptList={friendAcceptList}
                setFriendAcceptList={setFriendAcceptList}
              />
            )}
            {coinsAnnouncementList && (
              <CoinsAnnouncement
                coinsAnnouncementList={coinsAnnouncementList}
                setCoinsAnnouncementList={setCoinsAnnouncementList}
              />
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Notification;
