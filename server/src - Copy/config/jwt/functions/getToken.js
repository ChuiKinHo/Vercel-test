import jwt from "jsonwebtoken";
import Env from "../../../utils/constants/Env.js";

const getToken = (data, expiresTime) => {
  return jwt.sign(data, Env.JWT_SECRET, { expiresIn: expiresTime });
};

export default getToken;
