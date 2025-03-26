import mongoose from "mongoose";
import ModelNames from "../../utils/constants/ModelNames.js";

const { Schema } = mongoose;

const CommentsModel = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: ModelNames.userModel,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { collection: `${ModelNames.comments}`, timestamps: true }
);

export default CommentsModel;
