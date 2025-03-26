import { User, UserNotifications, Tasks } from "../../../models/index.js";
import Env from "../../../utils/constants/Env.js";
import getImageURLByTag from "../../../config/cloudinary/functions/getImageURLByTag.js";
import initialTasks from "../../../utils/helperFunctions/controllers/initialTasks.js";
import {
  ErrorMessages,
  SuccessMessages,
} from "../../../utils/constants/Message.js";

const register = async (req, res) => {
  try {
    const { email, password } = req.cookieValue;

    const defaultUserAvatar = await getImageURLByTag({
      filename: "default_user_avatar",
      tag: "default_user_avatar",
    });
    const defaultUserBanner = await getImageURLByTag({
      filename: "default_user_banner",
      tag: "default_user_banner",
    });

    const newUser = new User({
      role: "user",
      email: email,
      password: password,
      userAvatar: defaultUserAvatar,
      userBanner: defaultUserBanner,
    });

    const newUserNotifications = new UserNotifications({
      _id: newUser._id,
    });

    // Create Tasks for user
    const taskPromises = initialTasks.map(async (task) => {
      const newTask = new Tasks({
        title: task.title,
        category: task.category,
        description: task.description,
        coins: task.coins,
      });
      newUser.tasks.push(newTask._id);
      await newTask.save();
    });

    // Save all tasks in parallel
    await Promise.all(taskPromises);

    await newUser.save();
    await newUserNotifications.save();

    res.clearCookie(Env.USER_REGISTRATION_TOKEN_COOKIE);

    return res.status(201).json({
      status: 201,
      message: SuccessMessages.REGISTER_SUCCESS,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 500,
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
    });
  }
};

export default register;
