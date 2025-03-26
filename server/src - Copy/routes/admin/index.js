import express from "express";
import Env from "../../utils/constants/Env.js";
import validateCookies from "../../middleware/validateCookies.js";
import getAllNonVerifiedToiletsData from "./controllers/getAllNonVerifiedToiletsData.js";
import deleteNonVerifiedToilet from "./controllers/deleteNonVerifiedToilet.js";
import approveNonVerifiedToilet from "./controllers/approveNonVerifiedToilet.js";
import getAllNonVerifiedMultimedia from "./controllers/getAllNonVerifiedMultimedia.js";
import approveNonVerifiedMultimedia from "./controllers/approveNonVerifiedMultimedia.js";
import deleteNonVerifiedMultimedia from "./controllers/deleteNonVerifiedMultimedia.js";

const router = express.Router();

router.get(
  "/get/all-non-verified-toilets-data",
  validateCookies(Env.USER_LOGIN_TOKEN_COOKIE),
  getAllNonVerifiedToiletsData
);
router.get(
  "/get/all-non-verified-multimedia",
  validateCookies(Env.USER_LOGIN_TOKEN_COOKIE),
  getAllNonVerifiedMultimedia
);
router.post(
  "/delete/non-verified-toilet",
  validateCookies(Env.USER_LOGIN_TOKEN_COOKIE),
  deleteNonVerifiedToilet
);
router.post(
  "/delete/non-verified-multimedia",
  validateCookies(Env.USER_LOGIN_TOKEN_COOKIE),
  deleteNonVerifiedMultimedia
);
router.post(
  "/approve-non-verified-toilet",
  validateCookies(Env.USER_LOGIN_TOKEN_COOKIE),
  approveNonVerifiedToilet
);
router.post(
  "/approve-non-verified-multimedia",
  validateCookies(Env.USER_LOGIN_TOKEN_COOKIE),
  approveNonVerifiedMultimedia
);

export default router;
