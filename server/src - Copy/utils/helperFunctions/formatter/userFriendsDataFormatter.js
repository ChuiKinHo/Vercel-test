const userFriendsDataFormatter = (userFriends) => {
  const formattedUserFriends = userFriends?.map((friend) => {
    return {
      userId: friend?._id,
      fullname: friend?.fullname,
      username: friend?.username,
      userAvatar: friend?.userAvatar,
    };
  });

  return formattedUserFriends;
};

export default userFriendsDataFormatter;
