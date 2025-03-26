import mongoose from "mongoose";
import ModelNames from "../../utils/constants/ModelNames.js";
import {
  generateRandomFullname,
  generateRandomUsername,
} from "../../config/uuid/index.js";

const { Schema } = mongoose;

const UserModel = new Schema(
  {
    role: {
      type: String,
      required: true,
      enum: ["user", "guest_user", "admin"],
    },
    fullname: {
      type: String,
      required: true,
      default: () => generateRandomFullname(),
    },
    username: {
      type: String,
      required: true,
      default: () => generateRandomUsername(),
    },
    email: {
      type: String,
      required: function () {
        return this.role === "user" || this.role === "admin";
      },
      default: "",
    },
    password: {
      type: String,
      minlength: 8,
      required: function () {
        return this.role === "user" || this.role === "admin";
      },
    },
    userAvatar: { type: String },
    userBanner: { type: String },
    phone: { type: String, default: "" },
    tel_country_code: { type: String, default: "" },
    location: { type: String, default: "" },
    preference_language: { type: String, default: "en_us" },
    preference_marker: { type: String, default: "" },
    preference_font_size: { type: String, enum: ["S", "M", "L"], default: "M" },
    preference_theme: {
      type: String,
      enum: ["light", "dark", "dark1", "dark2"],
      default: "light",
    },
    preference_colorblind: {
      type: String,
      enum: ["default", "protanopia", "deuteranopia", "tritanopia", "achromatopsia"],
      default: "default",
    },
    toilet_bookmarks: [
      {
        type: Schema.Types.ObjectId,
        ref: ModelNames.toilet,
        default: [],
      },
    ],
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: ModelNames.userModel,
        default: [],
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: ModelNames.userModel,
        default: [],
      },
    ],
    coins: {
      type: Number,
      default: 0,
      min: [0, "Coins cannot be negative"],
    },
    exchange_records: {
      type: [
        {
          reward: {
            type: Schema.Types.ObjectId,
            ref: ModelNames.rewards,
            required: true,
          },
          exchanged_at: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
    tasks: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: ModelNames.tasks,
        },
      ],
      default: [],
    },
    login_history: {
      type: [
        {
          type: Date,
        },
      ],
      default: [],
    },
  },
  { collection: `${ModelNames.userModel}`, timestamps: true }
);

export default UserModel;
