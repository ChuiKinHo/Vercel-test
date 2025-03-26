import { Rewards } from "../../../models/index.js";
import rewardsFormatter from "../../../utils/helperFunctions/formatter/rewardsDataFormatter.js";
import {
  ErrorMessages,
  SuccessMessages,
} from "../../../utils/constants/Message.js";

const getRewardsData = async (req, res) => {
  try {
    const rewards = await Rewards.find();

    if (!rewards) {
      return res.status(400).json({
        status: 400,
        message: ErrorMessages.REWARD_NOT_FOUND,
      });
    }

    return res.status(200).json({
      status: 200,
      data: rewardsFormatter(rewards),
      message: SuccessMessages.GET_REWARDS_DATA_SUCCESS,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
    });
  }
};

export default getRewardsData;
