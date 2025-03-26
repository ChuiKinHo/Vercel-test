import CustomAvatar from "@components/common/Avatar/Avatar";
import CustomButton from "@components/common/Button/CustomButton";
import { useParams } from "next/navigation";
import { useMutation, useQueryClient } from "react-query";
import QUERY_KEYS from "@utils/constants/QueryKeys";
import sendFriendRequest from "@services/users/sendFriendRequest";
import unfollowFriend from "@services/users/unfollowFriend";
import { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import {
  displayErrorToast,
  displaySuccessToast,
} from "@components/common/Toast/CustomToast";

const ProfileAccountDetails = ({
  userData,
  userFriendsData,
  userFriendRequestsData,
  isGuest,
}) => {
  const params = useParams();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const [isFollowed, setIsFollowed] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    if (isGuest) {
      const userId = queryClient.getQueryData([QUERY_KEYS.USER_DATA])?.data
        .userId;
      const userFriendsData = queryClient.getQueryData([
        QUERY_KEYS.USER_FRIENDS_DATA,
      ])?.data;

      userFriendRequestsData?.forEach((requestedUser) => {
        if (requestedUser.userId === userId) {
          setIsRequesting(true);
          setIsFollowed(false);
        }
      });

      userFriendsData?.forEach((friend) => {
        if (friend.userId === params?.userId) {
          setIsFollowed(true);
          setIsRequesting(false);
        }
      });
    }
  }, [userFriendsData, userFriendRequestsData]);

  const { mutateAsync: SendFriendRequest } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: (res) => {
      setIsRequesting(true);
      setIsFollowed(false);
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        displayErrorToast(err.response?.data?.message);
        return;
      }
    },
  });

  const { mutateAsync: UnfollowFriend } = useMutation({
    mutationFn: unfollowFriend,
    onSuccess: (res) => {
      queryClient.setQueryData([QUERY_KEYS.USER_FRIENDS_DATA], res);
      setIsFollowed(false);
      setIsRequesting(false);
      // displaySuccessToast(res.message);
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        displayErrorToast(err.response?.data?.message);
        return;
      }
    },
  });

  return (
    <div className="text-text mt-7 md:mt-10 pl-0 md:pl-16">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-y-5 md:gap-x-20 w-full md:ml-10">
        <CustomAvatar
          src={userData?.userAvatar}
          alt="Profile User Avatar"
          style="default"
          varient="size-36 md:size-52"
        />

        <div className="flex flex-col items-center justify-center h-full gap-7">
          <div className="flex flex-col gap-1 items-center justify-center">
            <h1 className="max-w-[280px] md:max-w-full h-fit break-words text-center text-2xl md:text-4xl font-semibold">
              {userData?.fullname}
            </h1>
            <h2 className="max-w-[200px] md:max-w-full h-fit break-words text-center text-lg md:text-2xl font-medium">
              {userData?.username}
            </h2>
          </div>

          <div className="flex flex-row items-center justify-center gap-x-8 md:gap-x-12">
            <div className="flex flex-col items-center justify-center gap-2">
              <label className="text-md md:text-lg font-medium opacity-70">
                {t("profile_page.account_details.followers")}
              </label>
              <p className="font-medium">{userData?.followers.length || "0"}</p>
            </div>

            <div className="border border-s3 h-14"></div>

            <div className="flex flex-col items-center justify-center gap-2">
              <label className="text-md md:text-lg font-medium opacity-70">
                {t("profile_page.account_details.following")}
              </label>
              <p className="font-medium">{userFriendsData?.length || "0"}</p>
            </div>
          </div>
          {isGuest && (
            <div>
              {isFollowed ? (
                <CustomButton
                  type="button"
                  style="guest-profile-unfollow-btn"
                  text={t("common_phases.button.unfollow")}
                  textStyles="text-sm md:text-md font-semibold"
                  onClick={async () =>
                    await UnfollowFriend({ friendId: params?.userId })
                  }
                />
              ) : (
                <CustomButton
                  type="button"
                  style="guest-profile-follow-btn"
                  varient={
                    isRequesting ? "bg-s2" : "bg-sky-300 hover:bg-sky-400"
                  }
                  text={
                    isRequesting
                      ? t("common_phases.button.request_sent")
                      : t("common_phases.button.follow")
                  }
                  textStyles="text-sm md:text-md font-semibold"
                  onClick={async () =>
                    await SendFriendRequest({ guestId: params?.userId })
                  }
                  disabled={isRequesting}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileAccountDetails;
