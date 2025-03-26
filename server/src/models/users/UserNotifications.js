import mongoose from "mongoose";
import ModelNames from "../../utils/constants/ModelNames.js";

const { Schema } = mongoose;

const UserNotificationsModel = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      ref: ModelNames.userModel,
      required: true,
    },
    notifications: {
      type: [
        {
          user: {
            type: Schema.Types.ObjectId,
            ref: ModelNames.userModel,
            required: true,
          },
          role: {
            type: String,
            required: true,
            enum: ["friend_request", "friend_accept", "coins_announcement"],
          },
          value: {
            type: Number,
          },
        },
      ],
      default: [],
    },
  },
  { collection: `${ModelNames.userNotifications}`, timestamps: true }
);

export default UserNotificationsModel;
