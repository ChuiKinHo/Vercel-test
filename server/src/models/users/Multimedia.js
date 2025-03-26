import mongoose from "mongoose";
import ModelNames from "../../utils/constants/ModelNames.js";

const { Schema } = mongoose;

const MultimediaModel = new Schema(
  {
    role: {
      type: String,
      enum: ["verified", "non_verified"],
      default: "non_verified",
      required: true,
    },
    multimedia_type: {
      type: String,
      enum: ["image", "video"],
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: ModelNames.userModel,
    },
    toiletId: {
      type: Schema.Types.ObjectId,
      ref: ModelNames.toilet,
      default: null,
    },
    url: {
      type: String,
      require: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: ModelNames.userModel,
        default: [],
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: ModelNames.comments,
        default: [],
      },
    ],
  },
  { collection: `${ModelNames.multimedia}`, timestamps: true }
);

export default MultimediaModel;
