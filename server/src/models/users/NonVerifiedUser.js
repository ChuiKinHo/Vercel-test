import mongoose from "mongoose";
import ModelNames from "../../utils/constants/ModelNames.js";
import Env from "../../utils/constants/Env.js";

const { Schema } = mongoose;

const NonVerifiedUserModel = new Schema(
  {
    email: { type: String, required: true },
    code: { type: String },
    createdAt: {
      type: Date,
      default: Date.now,
      index: {
        expires: Env.USER_REGISTRATION_VERIFICATION_CODE_EXPIRES_IN,
      },
    },
  },
  { collection: `${ModelNames.nonVerifiedUser}`, timestamps: false }
);

export default NonVerifiedUserModel;
