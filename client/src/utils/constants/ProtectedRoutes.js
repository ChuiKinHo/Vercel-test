import WEB_ROUTE_PATHS from "@utils/constants/WebRoutes";

const PROTECTED_ROUTE_PATHS = {
  home: WEB_ROUTE_PATHS.user.home,
  profile: WEB_ROUTE_PATHS.user.profile,
  setting: WEB_ROUTE_PATHS.user.setting,
  rewards: WEB_ROUTE_PATHS.user.rewards,
  registrationVerification: WEB_ROUTE_PATHS.registrationVerification,
  resetPassword: WEB_ROUTE_PATHS.resetPassword,
  changeEmail: WEB_ROUTE_PATHS.changeEmail,
  map: WEB_ROUTE_PATHS.map,
  toiletVerification: WEB_ROUTE_PATHS.user.toiletVerification,
};

export default PROTECTED_ROUTE_PATHS;
