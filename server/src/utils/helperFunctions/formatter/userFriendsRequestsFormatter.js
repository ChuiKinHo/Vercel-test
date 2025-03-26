const userFriendRequestsFormatter = (userFriendRequests) => {
  const formattedUserFriendRequests = userFriendRequests?.map((user) => {
    return {
      userId: user?._id,
      fullname: user?.fullname,
      username: user?.username,
      userAvatar: user?.userAvatar,
    };
  });
  return formattedUserFriendRequests;
};

export default userFriendRequestsFormatter;
