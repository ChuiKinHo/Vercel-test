import { Tasks } from "../../models/index.js";

const refreshDailyTasks = async () => {
  try {
    const tasks = await Tasks.find({
      isCompleted: true,
      category: "daily",
      last_completed_at: { $ne: null },
    });

    if (tasks.length > 0) {
      const taskPromises = tasks.map(async (task) => {
        task.isCompleted = false;
        await task.save();
      });

      await Promise.all(taskPromises);

      console.log("Daily Tasks refreshed successfully.");
    }
  } catch (err) {
    console.error("Error on refreshing daily tasks:", err);
  }
};

export default refreshDailyTasks;
