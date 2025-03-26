import { User, Rewards } from "../../../models/index.js";
import userDataFormatter from "../../../utils/helperFunctions/formatter/userDataFormatter.js";
import {
  ErrorMessages,
  SuccessMessages,
} from "../../../utils/constants/Message.js";

const exchangeReward = async (req, res) => {
  try {
    const { userId } = req.cookieValue;
    const { rewardId } = req.body;

    const reward = await Rewards.findById(rewardId);
    if (!reward) {
      return res.status(400).json({
        status: 400,
        message: ErrorMessages.REWARD_NOT_FOUND,
      });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        status: 400,
        message: ErrorMessages.USER_NOT_FOUND,
      });
    }

    // Check user has enough coins
    if (user.coins < reward.required_coins) {
      return res.status(400).json({
        status: 400,
        message: ErrorMessages.INSUFFICIENT_COINS,
      });
    }

    // Check if the reward has been redeemed before
    await user.populate([
      {
        path: "exchange_records",
        select: "reward exchanged_at",
        populate: {
          path: "reward",
          select: "name_en name_zh required_coins image",
        },
      },
    ]);
    const isExchanged = user.exchange_records.some(
      (record) => record.reward._id === rewardId
    );
    if (isExchanged) {
      return res.status(400).json({
        status: 400,
        message: ErrorMessages.REWARD_REDEEMED,
      });
    }

    // Deduct user's coins and add to the record
    user.coins -= reward.required_coins;
    if (user.coins < 0) {
      user.coins = 0;
    }
    user.exchange_records.push({ reward: rewardId });
    await user.save();

    // Push the rewards to admin
    reward.user.push(userId);
    reward.quantity -= 1;
    if (reward.quantity < 0) {
      reward.quantity = 0;
    }
    await reward.save();
    const updatedUser = await user.populate([
      {
        path: "exchange_records",
        select: "reward exchanged_at",
        populate: {
          path: "reward",
          select: "name_en name_zh required_coins image",
        },
      },
    ]);

    return res.status(200).json({
      status: 200,
      data: userDataFormatter(updatedUser),
      message: SuccessMessages.EXCHANGE_REWARD_SUCCESS,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
    });
  }
};

export default exchangeReward;
