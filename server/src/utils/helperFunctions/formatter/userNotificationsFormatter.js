const userNotificationsFormatter = (notification) => {
  return notification?.map((data) => {
    return {
      role: data.role,
      value: data?.value,
      userId: data.user._id,
      userAvatar: data.user.userAvatar,
      username: data.user.username,
      fullname: data.user.fullname,
    };
  });
};

export default userNotificationsFormatter;
