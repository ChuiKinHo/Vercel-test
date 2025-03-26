import mongoose from "mongoose";
import ModelNames from "../../utils/constants/ModelNames.js";

const { Schema } = mongoose;

const ToiletModel = new Schema(
  {
    role: {
      type: String,
      required: true,
      enum: ["verified", "non_verified"],
      default: "verified",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: ModelNames.userModel,
    },
    name_en: { type: String },
    name_zh: { type: String },
    address_en: { type: String },
    address_zh: { type: String },
    sub_district_en: { type: String },
    sub_district_zh: { type: String },
    district_en: { type: String },
    district_zh: { type: String },
    area_en: { type: String },
    area_zh: { type: String },
    x_easting: { type: String },
    y_northing: { type: String },
    isMale: {
      type: String,
      enum: ["not_sure", "true", "false"],
      default: "not_sure",
    },
    isFemale: {
      type: String,
      enum: ["not_sure", "true", "false"],
      default: "not_sure",
    },
    isDisabled: {
      type: String,
      enum: ["not_sure", "true", "false"],
      default: "not_sure",
    },
    haveBathroom: {
      type: String,
      enum: ["not_sure", "true", "false"],
      default: "not_sure",
    },
    location: {
      type: { type: String, enum: ["Point"], required: true },
      coordinates: { type: [Number], required: true },
    },
    type_of_toilet: {
      type: String,
      enum: ["public", "private", "shopping_plaza", "restaurant"],
    },
    rating: [
      {
        type: Schema.Types.ObjectId,
        ref: ModelNames.rating,
        default: [],
      },
    ],
    views: {
      type: Number,
      min: 0,
      default: 0,
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: ModelNames.comments,
        default: [],
      },
    ],
    multimedia: [
      {
        type: Schema.Types.ObjectId,
        ref: ModelNames.multimedia,
        default: [],
      },
    ],
  },
  { collection: `${ModelNames.toilet}`, timestamps: true }
);

ToiletModel.index({ location: "2dsphere" });

export default ToiletModel;
