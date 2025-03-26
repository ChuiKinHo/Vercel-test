import express from "express";
import Env from "../../utils/constants/Env.js";
import validateSchema from "../../middleware/validateSchema.js";
import validateCookies from "../../middleware/validateCookies.js";
import validateToken from "../../middleware/validateToken.js";
import {
  userLoginSchema,
  codeVerificationSchema,
  personalDetailsSchema,
} from "../../utils/validationSchema/globalSchema.js";
import sendEmailVerificationCode from "./controllers/sendEmailVerificationCode.js";
import resendEmailVerificationCode from "./controllers/resendEmailVerificationCode.js";
import register from "./controllers/register.js";
import login from "./controllers/login.js";
import verifyCode from "./controllers/verifyCode.js";
import sendResetPasswordLink from "./controllers/sendResetPasswordLink.js";
import resetPassword from "./controllers/resetPassword.js";
import getResetPasswordCredential from "./controllers/getResetPasswordCredential.js";
import getUserData from "./controllers/getUserData.js";
import getRegistrationCredential from "./controllers/getRegistrationCredential.js";
import logout from "./controllers/logout.js";
import editPersonalDetails from "./controllers/editPersonalDetails.js";
import editUserAvatar from "./controllers/editUserAvatar.js";
import editUserBanner from "./controllers/editUserBanner.js";
import searchUsers from "./controllers/searchUsers.js";
import getGuestData from "./controllers/getGuestData.js";
import sendFriendRequest from "./controllers/sendFriendRequest.js";
import acceptFriendRequest from "./controllers/acceptFriendRequest.js";
import getUserFriendsData from "./controllers/getUserFriendsData.js";
import getGuestFriendsData from "./controllers/getGuestFriendsData.js";
import unfollowFriend from "./controllers/unfollowFriend.js";
import getGuestFriendRequestsData from "./controllers/getGuestFriendRequestsData.js";
import getUserFriendRequestsData from "./controllers/getUserFriendRequestsData.js";
import getUserNotifications from "./controllers/getUserNotifications.js";
import cancelNotification from "./controllers/cancelNotification.js";
import changeUserPreferenceLanguage from "./controllers/changeUserPreferenceLanguage.js";
import changeUserPreferenceFontSize from "./controllers/changeUserPreferenceFontSize.js";
import changeUserPreferenceColorblind from "./controllers/changeUserPreferenceColorblind.js";
import changeUserPreferenceTheme from "./controllers/changeUserPreferenceTheme.js";
import loginAsGuest from "./controllers/loginAsGuest.js";
import changePassword from "./controllers/changePassword.js";
import sendChangeEmailLink from "./controllers/sendChangeEmailLink.js";
import changeEmail from "./controllers/changeEmail.js";
import getRewardsData from "./controllers/getRewardsData.js";
import exchangeReward from "./controllers/exchangeReward.js";

const router = express.Router();

router.post(
  "/register/send-verification-code",
  validateSchema(userLoginSchema),
  sendEmailVerificationCode
);
router.post(
  "/register/resend-verification-code",
  validateCookies(Env.USER_REGISTRATION_TOKEN_COOKIE),
  resendEmailVerificationCode
);
router.post(
  "/register/verify-code",
  validateSchema(codeVerificationSchema),
  validateCookies(Env.USER_REGISTRATION_TOKEN_COOKIE),
  verifyCode
);
router.post("/login/send-reset-password-link", sendResetPasswordLink);
router.get(
  "/login/reset-password/get/reset-password-credential",
  validateToken,
  getResetPasswordCredential
);
router.post("/login/reset-password", resetPassword);
router.post(
  "/register",
  validateCookies(Env.USER_REGISTRATION_TOKEN_COOKIE),
  register
);
router.post("/login", validateSchema(userLoginSchema), login);
router.get("/login-as-guest", loginAsGuest);
router
  .route("/login/get/user-data")
  .get(validateCookies(Env.USER_LOGIN_TOKEN_COOKIE), getUserData)
  .post(validateCookies(Env.USER_LOGIN_TOKEN_COOKIE), getGuestData);
router.get(
  "/register/get/registration-credential",
  validateCookies(Env.USER_REGISTRATION_TOKEN_COOKIE),
  getRegistrationCredential
);
router.get("/logout", logout);
router.post(
  "/profile/edit-personal-details",
  validateCookies(Env.USER_LOGIN_TOKEN_COOKIE),
  validateSchema(personalDetailsSchema),
  editPersonalDetails
);
router.post(
  "/profile/edit-user-avatar",
  validateCookies(Env.USER_LOGIN_TOKEN_COOKIE),
  editUserAvatar
);
router.post(
  "/profile/edit-user-banner",
  validateCookies(Env.USER_LOGIN_TOKEN_COOKIE),
  editUserBanner
);
router.post(
  "/profile/friends/search-users",
  validateCookies(Env.USER_LOGIN_TOKEN_COOKIE),
  searchUsers
);
router.post(
  "/profile/friends/send-friend-request",
  validateCookies(Env.USER_LOGIN_TOKEN_COOKIE),
  sendFriendRequest
);
router
  .route("/profile/friends/get/friend-requests-data")
  .get(validateCookies(Env.USER_LOGIN_TOKEN_COOKIE), getUserFriendRequestsData)
  .post(
    validateCookies(Env.USER_LOGIN_TOKEN_COOKIE),
    getGuestFriendRequestsData
  );
router.post(
  "/profile/friends/accept-friend-request",
  validateCookies(Env.USER_LOGIN_TOKEN_COOKIE),
  acceptFriendRequest
);
router
  .route("/profile/friends/get/user-friends-data")
  .get(validateCookies(Env.USER_LOGIN_TOKEN_COOKIE), getUserFriendsData)
  .post(validateCookies(Env.USER_LOGIN_TOKEN_COOKIE), getGuestFriendsData);
router.post(
  "/profile/friends/unfollow-friend",
  validateCookies(Env.USER_LOGIN_TOKEN_COOKIE),
  unfollowFriend
);
router.get(
  "/profile/get/user-notifications",
  validateCookies(Env.USER_LOGIN_TOKEN_COOKIE),
  getUserNotifications
);
router.post(
  "/profile/cancel-notification",
  validateCookies(Env.USER_LOGIN_TOKEN_COOKIE),
  cancelNotification
);
router.post(
  "/setting/change-preference-language",
  validateCookies(Env.USER_LOGIN_TOKEN_COOKIE, false),
  changeUserPreferenceLanguage
);
router.post(
  "/setting/change-preference-font-size",
  validateCookies(Env.USER_LOGIN_TOKEN_COOKIE),
  changeUserPreferenceFontSize
);
router.post(
  "/setting/change-preference-theme",
  validateCookies(Env.USER_LOGIN_TOKEN_COOKIE),
  changeUserPreferenceTheme
);
router.post(
  "/setting/change-preference-colorblind",
  validateCookies(Env.USER_LOGIN_TOKEN_COOKIE),
  changeUserPreferenceColorblind
);
router.post(
  "/setting/change-password",
  validateCookies(Env.USER_LOGIN_TOKEN_COOKIE),
  changePassword
);
router.post(
  "/setting/send-change-email-link",
  validateCookies(Env.USER_LOGIN_TOKEN_COOKIE),
  sendChangeEmailLink
);
router.post("/setting/change-email", changeEmail);
router.get(
  "/get/rewards-data",
  validateCookies(Env.USER_LOGIN_TOKEN_COOKIE),
  getRewardsData
);
router.post(
  "/exchange-reward",
  validateCookies(Env.USER_LOGIN_TOKEN_COOKIE),
  exchangeReward
);

export default router;
