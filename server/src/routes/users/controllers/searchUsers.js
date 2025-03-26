import { User } from "../../../models/index.js";
import mongoose from "mongoose";
import {
  ErrorMessages,
  SuccessMessages,
} from "../../../utils/constants/Message.js";

const batchSize = 10;

const searchUsers = async (req, res) => {
  try {
    const { userId } = req.cookieValue;
    const { username: searchUsername } = req.body;

    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: new mongoose.Types.ObjectId(String(userId)) },
          username: { $regex: searchUsername, $options: "i" },
        },
      },
      {
        $limit: batchSize,
      },
      {
        $project: {
          userId: "$_id",
          _id: 0,
          fullname: 1,
          username: 1,
          userAvatar: 1,
        },
      },
    ]);

    return res.status(200).json({
      status: 200,
      data: users ? users : [],
      message: SuccessMessages.GET_USERS_IN_BATCH_SUCCESS,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
    });
  }
};

export default searchUsers;
