import { Tasks } from "../../models/index.js";

const refreshYearlyTasks = async () => {
  try {
    const tasks = await Tasks.find({
      isCompleted: true,
      category: "yearly",
      last_completed_at: { $ne: null },
    });

    if (tasks.length > 0) {
      const taskPromises = tasks.map(async (task) => {
        task.isCompleted = false;
        await task.save();
      });

      await Promise.all(taskPromises);

      console.log("Yearly Tasks refreshed successfully.");
    }
  } catch (err) {
    console.error("Error on refreshing yearly tasks:", err);
  }
};

export default refreshYearlyTasks;
