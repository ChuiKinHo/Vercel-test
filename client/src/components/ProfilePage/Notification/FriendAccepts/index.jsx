import CustomAvatar from "@components/common/Avatar/Avatar";
import CustomButton from "@components/common/Button/CustomButton";
import WEB_ROUTE_PATHS from "@utils/constants/WebRoutes";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useMutation } from "react-query";
import Link from "next/link";
import axios from "axios";
import cancelNotification from "@services/users/cancelNotification";
import { useTranslation } from "react-i18next";
import NOTIFICATION_ROLE from "@utils/constants/NotificationRole";
import {
  displayErrorToast,
  displaySuccessToast,
} from "@components/common/Toast/CustomToast";

const FriendAccepts = ({ friendAcceptList, setFriendAcceptList }) => {
  const { t } = useTranslation();

  const { mutateAsync: CancelNotification } = useMutation({
    mutationFn: cancelNotification,
    onSuccess: (res) => {
      setFriendAcceptList(res.data);
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        displayErrorToast(err.response?.data?.message);
        return;
      }
    },
  });

  return friendAcceptList?.map((user, index) => (
    <li key={index} className="w-full">
      <div className="flex flex-row pl-3 md:pl-6 pr-3 pt-4 gap-x-3 md:gap-x-4 items-center relative group">
        <CustomButton
          icon={<XMarkIcon className="size-4" />}
          style="notification-cancel-btn"
          onClick={async () =>
            await CancelNotification({
              userId: user.userId,
              role: NOTIFICATION_ROLE.FRIEND_ACCEPT,
            })
          }
        />

        <CustomAvatar
          src={user.userAvatar}
          alt="User Avatar"
          varient="size-7"
        />

        <div className="text-sm break-words min-w-[160px] md:min-w-[210px] leading-tight">
          <Link
            href={`${WEB_ROUTE_PATHS.user.profile}/${user.userId}`}
            className="font-bold hover:underline decoration-2 decoration-black underline-offset-2"
          >
            {`${user.fullname} `}
          </Link>
          <span className="font-medium">
            {t("notifications.friend_accept")}
          </span>
        </div>
      </div>
    </li>
  ));
};

export default FriendAccepts;
