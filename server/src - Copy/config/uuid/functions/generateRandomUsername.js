import { v4 as uuid } from "uuid";

const generateRandomUsername = () => {
  return `username_${uuid().substring(0,8)}`;
};

export default generateRandomUsername;
