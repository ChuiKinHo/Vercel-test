import { v4 as uuid } from "uuid";

const generateRandomFullname = () => {
  return `fullname_${uuid().substring(0,8)}`;
};

export default generateRandomFullname;
