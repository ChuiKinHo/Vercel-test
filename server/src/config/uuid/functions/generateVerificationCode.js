import { v4 as uuid } from "uuid";

const generateVerificationCode = () => {
  return uuid().replace(/\D/g, "").substring(0, 6);
};

export default generateVerificationCode;
