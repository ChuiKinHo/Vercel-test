"use client";

import { useState } from "react";
import { useQueries } from "react-query";
import { useParams } from "next/navigation";
import withAuth from "@layout/ProtectedRoutes/withAuth";
import ProfileLayout from "@components/ProfilePage/Layout";
import ProfileNavigationBar from "@components/ProfilePage/Navigation";
import ProfileAccountDetails from "@components/ProfilePage/AccountDetails";
import ProfileFriendsDetails from "@components/ProfilePage/FriendsProfile/FriendsDetails";
import ProfilePersonalDetails from "@components/ProfilePage/PersonalProfile/PersonalDetails";
import QUERY_KEYS from "@utils/constants/QueryKeys";
import getUserNotifications from "@services/users/getUserNotifications";
import getUserFriendsData from "@services/users/getUserFriendsData";
import getUserFriendRequestsData from "@services/users/getUserFriendRequestsData";
import getGuestFriendsData from "@services/users/getGuestFriendsData";
import getGuestFriendRequestsData from "@services/users/getGuestFriendRequestsData";

const ButtonStates = {
  PROFILE: "profile",
  FRIENDS: "friends",
};

const ProfilePage = ({ userData, isGuest, isGuestUser }) => {
  const params = useParams();

  const [buttonState, setButtonState] = useState(ButtonStates.PROFILE);

  const queriesConfig = [
    {
      queryKey: [QUERY_KEYS.USER_FRIENDS_DATA],
      queryFn: getUserFriendsData,
      retry: 2,
      refetchOnMount: "always",
      refetchOnWindowFocus: "true",
    },
    {
      queryKey: [QUERY_KEYS.USER_FRIEND_REQUESTS_DATA],
      queryFn: getUserFriendRequestsData,
      retry: 2,
      refetchOnMount: "always",
      refetchOnWindowFocus: "true",
    },
    {
      queryKey: [QUERY_KEYS.USER_NOTIFICATIONS],
      queryFn: getUserNotifications,
      retry: 2,
      refetchOnMount: "always",
      refetchOnWindowFocus: "true",
    },
    {
      queryKey: [QUERY_KEYS.GUEST_FRIENDS_DATA],
      queryFn: async () =>
        await getGuestFriendsData({ guestId: params?.userId }),
      retry: 2,
      refetchOnMount: "always",
      refetchOnWindowFocus: "true",
    },
    {
      queryKey: [QUERY_KEYS.GUEST_FRIEND_REQUESTS_DATA, params?.userId],
      queryFn: async () =>
        await getGuestFriendRequestsData({ guestId: params?.userId }),
      retry: 2,
      refetchOnMount: "always",
      refetchOnWindowFocus: "true",
    },
  ];

  const [
    { data: userFriendsData },
    { data: userFriendRequestsData },
    { data: userNotifications },
    { data: guestFriendsData },
    { data: guestFriendRequestsData },
  ] = useQueries(queriesConfig);

  const renderPersonalDetails = () => {
    setButtonState(ButtonStates.PROFILE);
  };

  const renderFriendsDetails = () => {
    setButtonState(ButtonStates.FRIENDS);
  };

  return (
    <ProfileLayout
      userData={userData}
      userNotifications={userNotifications?.data}
      isGuest={isGuest}
      isGuestUser={isGuestUser}
    >
      <div>
        <ProfileAccountDetails
          userData={userData}
          userFriendsData={
            isGuest ? guestFriendsData?.data : userFriendsData?.data
          }
          userFriendRequestsData={
            isGuest
              ? guestFriendRequestsData?.data
              : userFriendRequestsData?.data
          }
          isGuest={isGuest}
        />
        <ProfileNavigationBar
          buttonState={buttonState}
          onClickPersonalDetails={renderPersonalDetails}
          onClickFriendsDetails={renderFriendsDetails}
        />
        {buttonState === ButtonStates.PROFILE && (
          <ProfilePersonalDetails userData={userData} isGuest={isGuest} />
        )}
        {buttonState === ButtonStates.FRIENDS && (
          <ProfileFriendsDetails
            userFriendsData={
              isGuest ? guestFriendsData?.data : userFriendsData?.data
            }
            isGuest={isGuest}
          />
        )}
      </div>
    </ProfileLayout>
  );
};

export default withAuth(ProfilePage);
