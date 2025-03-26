import CustomAvatar from "@components/common/Avatar/Avatar";
import CustomButton from "@components/common/Button/CustomButton";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useMutation } from "react-query";
import axios from "axios";
import cancelNotification from "@services/users/cancelNotification";
import { useTranslation } from "react-i18next";
import NOTIFICATION_ROLE from "@utils/constants/NotificationRole";
import {
  displayErrorToast,
} from "@components/common/Toast/CustomToast";

const CoinsAnnouncement = ({
  coinsAnnouncementList,
  setCoinsAnnouncementList,
}) => {
  const { t } = useTranslation();

  const { mutateAsync: CancelNotification } = useMutation({
    mutationFn: cancelNotification,
    onSuccess: (res) => {
      setCoinsAnnouncementList(res.data);
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        displayErrorToast(err.response?.data?.message);
        return;
      }
    },
  });

  return coinsAnnouncementList?.map((user, index) => (
    <li key={index} className="w-full">
      <div className="flex flex-row pl-3 md:pl-6 pr-3 pt-4 gap-x-3 md:gap-x-4 items-center relative group">
        <CustomButton
          icon={<XMarkIcon className="size-4" />}
          style="notification-cancel-btn"
          onClick={async () =>
            await CancelNotification({
              userId: user.userId,
              role: NOTIFICATION_ROLE.COINS_ANNOUNCEMENT,
            })
          }
        />
        <CustomAvatar
          src={user.userAvatar}
          alt="User Avatar"
          varient="size-7"
        />
        <div className="text-sm break-words min-w-[160px] md:min-w-[210px] leading-tight">
          <p className="font-medium">
            {t("notifications.coins_announcement")}
            <span className="font-bold text-sm text-url">{user.value}</span>
            {t("notifications.coins")}
          </p>
        </div>
      </div>
    </li>
  ));
};

export default CoinsAnnouncement;
