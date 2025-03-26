import Env from "../src/utils/constants/Env.js";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import userRoute from "../src/routes/users/index.js";
import mapRoute from "../src/routes/map/index.js";
import cookieParser from "cookie-parser";
import userAvatarFolderPreset from "../src/config/cloudinary/preset/userAvatarPreset.js";
import userBannerFolderPreset from "../src/config/cloudinary/preset/userBannerPreset.js";
import toiletVideosFolderPreset from "../src/config/cloudinary/preset/toiletVideosPreset.js";
import toiletImagesFolderPreset from "../src/config/cloudinary/preset/toiletImagesPreset.js";
import importToiletData from "../src/data/importToiletData.js";
import importRewardsData from "../src/data/importRewardsData.js";
import adminRoute from "../src/routes/admin/index.js";
import "../src/scheduler/index.js"

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    origin: Env.WEBSITE_DOMAIN,
    credentials: true,
  })
);

// Server Routes
app.use("/users", userRoute);
app.use("/admin", adminRoute);
app.use("/map", mapRoute);

// MongoDB database configuration
console.log("Env: ")
console.log(Env)
console.warn("process.env: ")
console.warn(process.env)
console.log("Mongo: ")
console.log(Env.MongoDB_URL)
console.log(process.env.MongoDB_URL)
console.error("Env: ")
console.error(Env)
mongoose
  .connect("mongodb+srv://admin:cHIWFcXV1UdyxzEu@db.dmfby.mongodb.net/ToiletGuide?retryWrites=true&w=majority&appName=ToiletGuide")
  // .connect(Env.MongoDB_URL)
  .then(async () => {
    app.listen(Env.PORT, async (result) => {
      console.log(
        `Successfully connect to Database with Server Port ${Env.PORT}`
      );
    });
    await userAvatarFolderPreset();
    await userBannerFolderPreset();
    await toiletImagesFolderPreset();
    await toiletVideosFolderPreset();
    await importToiletData();
    await importRewardsData();
  })

  .catch((err) => {
    console.warn("Fail to connect to Database: ", err);
  });
