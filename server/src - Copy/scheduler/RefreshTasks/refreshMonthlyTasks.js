import { Tasks } from "../../models/index.js";

const refreshMonthlyTasks = async () => {
  try {
    const tasks = await Tasks.find({
      isCompleted: true,
      category: "monthly",
      last_completed_at: { $ne: null },
    });

    if (tasks.length > 0) {
      const taskPromises = tasks.map(async (task) => {
        task.isCompleted = false;
        await task.save();
      });

      await Promise.all(taskPromises);

      console.log("Monthly Tasks refreshed successfully.");
    }
  } catch (err) {
    console.error("Error on refreshing monthly tasks:", err);
  }
};

export default refreshMonthlyTasks;
