import mongoose from "mongoose";
import ModelNames from "../../utils/constants/ModelNames.js";

const { Schema } = mongoose;

const RewardsModel = new Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ["coupon", "souvenir"],
    },
    name_en: {
      type: String,
      default: "",
    },
    name_zh: {
      type: String,
      default: "",
    },
    quantity: {
      type: Number,
      default: 0,
      require: true,
      min: [0, "Quantity cannot be negative"],
    },
    required_coins: {
      type: Number,
      require: true,
      min: [0, "Coins cannot be negative"],
    },
    image: {
      type: String,
      default: "",
    },
    user: [
      {
        type: Schema.Types.ObjectId,
        ref: ModelNames.userModel,
        default: [],
      },
    ],
  },
  { collection: `${ModelNames.rewards}`, timestamps: true }
);

export default RewardsModel;
