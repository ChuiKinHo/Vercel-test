// import { i18n } from "src/contexts/LanguageProvider";

const calculateTimeInterval = (createdDate) => {
  const now = new Date();
  const interval = now - new Date(createdDate);

  const days = Math.floor(interval / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (interval % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((interval % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((interval % (1000 * 60)) / 1000);

  let formattedTime = "";
  if (days > 0) {
  //   formattedTime = `${days} ${i18n.t("common_phases.format.time.days")}`;
  // } else if (hours > 0) {
  //   formattedTime = `${hours} ${i18n.t("common_phases.format.time.hours")}`;
  // } else if (minutes > 0) {
  //   formattedTime = `${minutes} ${i18n.t("common_phases.format.time.minutes")}`;
  // } else {
  //   formattedTime = `${seconds} ${i18n.t("common_phases.format.time.seconds")}`;
  }

  return formattedTime;
};

export default calculateTimeInterval;
