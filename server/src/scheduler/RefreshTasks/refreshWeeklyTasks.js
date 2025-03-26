import { Tasks } from "../../models/index.js";

const refreshWeeklyTasks = async () => {
  try {
    const tasks = await Tasks.find({
      isCompleted: true,
      category: "weekly",
      last_completed_at: { $ne: null },
    });

    if (tasks.length > 0) {
      const taskPromises = tasks.map(async (task) => {
        task.isCompleted = false;
        await task.save();
      });

      await Promise.all(taskPromises);

      console.log("Weekly Tasks refreshed successfully.");
    }
  } catch (err) {
    console.error("Error on refreshing weekly tasks:", err);
  }
};

export default refreshWeeklyTasks;
