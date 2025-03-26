import mongoose from "mongoose";
import ModelNames from "../utils/constants/ModelNames.js";
import UserModel from "./users/User.js";
import NonVerifiedUserModel from "./users/NonVerifiedUser.js";
import UserNotificationsModel from "./users/UserNotifications.js";
import MultimediaModel from "./users/Multimedia.js";
import CommentsModel from "./users/Comments.js";
import ToiletModel from "./toilets/Toilet.js";
import RatingModel from "./toilets/Rating.js";
import RewardsModel from "./users/Rewards.js";
import TasksModel from "./users/Tasks.js";

const User = mongoose.model(`${ModelNames.userModel}`, UserModel);
const NonVerifiedUser = mongoose.model(
  `${ModelNames.nonVerifiedUser}`,
  NonVerifiedUserModel
);
const UserNotifications = mongoose.model(
  `${ModelNames.userNotifications}`,
  UserNotificationsModel
);
const Multimedia = mongoose.model(`${ModelNames.multimedia}`, MultimediaModel);
const Comments = mongoose.model(`${ModelNames.comments}`, CommentsModel);
const Toilet = mongoose.model(`${ModelNames.toilet}`, ToiletModel);
const Rating = mongoose.model(`${ModelNames.rating}`, RatingModel);
const Rewards = mongoose.model(`${ModelNames.rewards}`, RewardsModel);
const Tasks = mongoose.model(`${ModelNames.tasks}`, TasksModel);

export {
  User,
  NonVerifiedUser,
  UserNotifications,
  Multimedia,
  Comments,
  Toilet,
  Rating,
  Rewards,
  Tasks,
};
