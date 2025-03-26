import schedule from "node-schedule";
import refreshDailyTasks from "./RefreshTasks/refreshDailyTasks.js";
import refreshMonthlyTasks from "./RefreshTasks/refreshMonthlyTasks.js";
import refreshWeeklyTasks from "./RefreshTasks/refreshWeeklyTasks.js";
import refreshYearlyTasks from "./RefreshTasks/refreshYearlyTask.js";

const dailyRule = new schedule.RecurrenceRule(); // Every day after 12 AM
dailyRule.hour = 0; // 12 AM
dailyRule.minute = 0;
dailyRule.second = 0;

const weeklyRule = new schedule.RecurrenceRule(); // Every week after Monday at 12 AM
weeklyRule.dayOfWeek = 1; // Monday
weeklyRule.hour = 0;
weeklyRule.minute = 0;
weeklyRule.second = 0;

const monthlyRule = new schedule.RecurrenceRule(); // Every month after 1st date of the month at 12 AM
monthlyRule.date = 1; // 1st date of the month
monthlyRule.hour = 0;
monthlyRule.minute = 0;
monthlyRule.second = 0;

const yearlyRule = new schedule.RecurrenceRule(); // Every year after 1st of the year at 12 AM
yearlyRule.month = 0; // January
yearlyRule.date = 1;
yearlyRule.hour = 0;
yearlyRule.minute = 0;
yearlyRule.second = 0;

schedule.scheduleJob(dailyRule, async () => {
  console.log("Running daily scheduler ...");
  await refreshDailyTasks();
  console.log("Scheduler runs successfully");
});

schedule.scheduleJob(weeklyRule, async () => {
  console.log("Running weekly scheduler ...");
  await refreshWeeklyTasks();
  console.log("Scheduler runs successfully");
});

schedule.scheduleJob(monthlyRule, async () => {
  console.log("Running monthly scheduler ...");
  await refreshMonthlyTasks();
  console.log("Scheduler runs successfully");
});

schedule.scheduleJob(yearlyRule, async () => {
  console.log("Running yearly scheduler ...");
  await refreshYearlyTasks();
  console.log("Scheduler runs successfully");
});
