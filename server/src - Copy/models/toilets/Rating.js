import mongoose from "mongoose";
import ModelNames from "../../utils/constants/ModelNames.js";

const { Schema } = mongoose;

const RatingModel = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: ModelNames.userModel,
      required: true,
    },
    value: {
      type: Number,
      min: 0,
      max: 5,
      required: true,
    },
  },
  { collection: `${ModelNames.rating}`, timestamps: true }
);

export default RatingModel;
