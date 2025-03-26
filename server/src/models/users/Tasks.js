import mongoose from "mongoose";
import ModelNames from "../../utils/constants/ModelNames.js";
import COOLDOWNS from "../../utils/helperFunctions/models/Cooldowns.js";

const { Schema } = mongoose;

const TasksModel = new Schema(
  {
    title: {
      type: String,
      enum: [
        "view-toilet",
        "add-toilet",
        "login",
        "edit-profile",
        "edit-user-avatar",
        "add-toilet-comment",
        "add-multimedia-comment",
        "add-toilet-multimedia",
      ],
      required: true,
    },
    category: {
      type: String,
      enum: ["one-time", "daily", "weekly", "monthly", "yearly"],
      required: true,
    },
    description: { type: String },
    coins: { type: Number, required: true },
    cooldown: {
      type: Number,
      default: function () {
        return COOLDOWNS[this.category];
      },
    },
    last_completed_at: {
      type: Date,
      default: null,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { collection: `${ModelNames.tasks}`, timestamps: true }
);

export default TasksModel;
