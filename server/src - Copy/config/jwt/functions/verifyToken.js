import jwt from "jsonwebtoken";
import Env from "../../../utils/constants/Env.js";

const verifyToken = (token) => {
  return jwt.verify(token, Env.JWT_SECRET);
};

export default verifyToken;
