import { Toilet, User } from "../../../models/index.js";
import userDataFormatter from "../../../utils/helperFunctions/formatter/userDataFormatter.js";
import {
  ErrorMessages,
  SuccessMessages,
} from "../../../utils/constants/Message.js";

const updateToiletBookmark = async (req, res) => {
  try {
    const { userId, toiletId } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: ErrorMessages.USER_NOT_FOUND,
      });
    }

    const toilet = await Toilet.findById(toiletId);

    if (!toilet) {
      return res.status(404).json({
        status: 404,
        message: ErrorMessages.TOILET_NOT_FOUND,
      });
    }

    const isUserBookmarked = user.toilet_bookmarks.includes(toiletId);
    if (isUserBookmarked) {
      user.toilet_bookmarks = user.toilet_bookmarks.filter(
        (id) => id.toString() !== toiletId.toString()
      );
    } else {
      user.toilet_bookmarks.push(toiletId);
    }
    await user.save();

    const updatedUser = await User.findById(userId).populate({
      path: "toilet_bookmarks",
      select: "_id name_zh name_en address_zh address_en district_zh district_en location rating views comments isMale isFemale isDisabled haveBathroom",
    });

    return res.status(200).json({
      status: 200,
      data: userDataFormatter(updatedUser),
      message: SuccessMessages.UPDATE_TOILET_BOOKMARK_SUCCESS,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
    });
  }
};

export default updateToiletBookmark;
