import { User } from "../../../models/index.js";
import userFriendsDataFormatter from "../../../utils/helperFunctions/formatter/userFriendsDataFormatter.js";
import {
  ErrorMessages,
  SuccessMessages,
} from "../../../utils/constants/Message.js";

const unfollowFriend = async (req, res) => {
  try {
    const { userId } = req.cookieValue;
    const { friendId } = req.body;

    const user = await User.findById(userId).populate([
      {
        path: "friends",
        select: "_id userAvatar username fullname",
      },
    ]);
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: ErrorMessages.USER_NOT_FOUND,
      });
    }
    const friend = await User.findById(friendId);
    if (!friend) {
      return res.status(404).json({
        status: 404,
        message: ErrorMessages.GUEST_NOT_FOUND,
      });
    }

    // Remove the guest from user
    user.friends = user.friends.filter(
      (friend) => friend._id.toString() !== friendId
    );

    // Update the follower of the guest
    friend.followers = friend.followers.filter(
      (follower) => follower.toString() !== userId
    );

    await friend.save();
    await user.save();

    return res.status(200).json({
      status: 200,
      data: userFriendsDataFormatter(user.friends),
      message: SuccessMessages.UNFOLLOW_FRIEND_SUCCESS,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
    });
  }
};

export default unfollowFriend;
