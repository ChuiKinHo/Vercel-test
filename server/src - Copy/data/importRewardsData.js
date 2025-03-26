import xlsx from "xlsx";
import path from "path";
import { Rewards } from "../models/index.js";

const importRewardsData = async () => {
  try {
    console.log("Loading rewards data to database...");

    // Load the Excel file
    const filePath = path.join(process.cwd(), "src", "data", "rewards.xlsx");
    const workbook = xlsx.readFile(filePath);

    // Extract different rewards data
    const rewards_sheet_name = workbook.SheetNames[0];

    const rewards_data = xlsx.utils.sheet_to_json(
      workbook.Sheets[rewards_sheet_name]
    );

    const rewards = rewards_data.map((row) => ({
      category: row.category,
      name_en: row.name_en,
      name_zh: row.name_zh,
      quantity: row.quantity,
      required_coins: row.required_coins,
      image: row.image,
    }));

    for (const reward of rewards) {
      const existingReward = await Rewards.findOne({
        name_en: reward.name_en,
        name_zh: reward.name_zh,
        category: reward.category,
      });
      if (!existingReward) {
        // create new reward
        await Rewards.create(reward);
      } else {
        // Change name_en, name_zh, required_coins, image and category only
        existingReward.name_en = reward.name_en;
        existingReward.name_zh = reward.name_zh;
        existingReward.required_coins = reward.required_coins;
        existingReward.image = reward.image;
        existingReward.category = reward.category;
        await existingReward.save();
      }
    }

    console.log("Rewards data imported successfully.");
  } catch (err) {
    console.error("Error when importing Rewards:", err);
  }
};

export default importRewardsData;
