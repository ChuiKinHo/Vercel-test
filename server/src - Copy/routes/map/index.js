import express from "express";
import Env from "../../utils/constants/Env.js";
import validateSchema from "../../middleware/validateSchema.js";
import validateCookies from "../../middleware/validateCookies.js";
import getToiletsLocationNearby from "./controllers/getToiletsLocationNearby.js";
import updateToiletRating from "./controllers/updateToiletRating.js";
import updateToiletViews from "./controllers/updateToiletViews.js";
import addToiletComment from "./controllers/addToiletComment.js";
import updateToiletBookmark from "./controllers/updateToiletBookmark.js";
import getAllVerifiedToiletsData from "./controllers/getAllVerifiedToiletData.js";
import likeToiletMultimedia from "./controllers/likeToiletMultimedia.js";
import addMultimediaComment from "./controllers/addMultimediaComment.js";
import addToilet from "./controllers/addToilet.js";
import addToiletMultimedia from "./controllers/addToiletMultimedia.js";
import changePreferenceMarker from "./controllers/changePreferenceMarker.js";

const router = express.Router();

router.post("/get-toilets-location-nearby", getToiletsLocationNearby);
router.post(
  "/update-toilet-rating",
  validateCookies(Env.USER_LOGIN_TOKEN_COOKIE),
  updateToiletRating
);
router.post(
  "/update-toilet-views",
  validateCookies(Env.USER_LOGIN_TOKEN_COOKIE, false),
  updateToiletViews
);
router.post(
  "/add-toilet-comment",
  validateCookies(Env.USER_LOGIN_TOKEN_COOKIE),
  addToiletComment
);
router.post(
  "/update-toilet-bookmark",
  validateCookies(Env.USER_LOGIN_TOKEN_COOKIE),
  updateToiletBookmark
);
router.get(
  "/get/all-verified-toilet-data",
  validateCookies(Env.USER_LOGIN_TOKEN_COOKIE, false),
  getAllVerifiedToiletsData
);
router.post(
  "/add-toilet",
  validateCookies(Env.USER_LOGIN_TOKEN_COOKIE),
  addToilet
);
router.post(
  "/add-toilet-multimedia",
  validateCookies(Env.USER_LOGIN_TOKEN_COOKIE),
  addToiletMultimedia
);
router.post(
  "/like-toilet-multimedia",
  validateCookies(Env.USER_LOGIN_TOKEN_COOKIE),
  likeToiletMultimedia
);
router.post(
  "/add-multimedia-comment",
  validateCookies(Env.USER_LOGIN_TOKEN_COOKIE),
  addMultimediaComment
);
router.post(
  "/change-preference-marker",
  validateCookies(Env.USER_LOGIN_TOKEN_COOKIE),
  changePreferenceMarker
);

export default router;
