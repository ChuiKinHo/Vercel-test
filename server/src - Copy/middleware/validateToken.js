import jwt from "jsonwebtoken";
import Env from "../utils/constants/Env.js";
import { ErrorMessages } from "../utils/constants/Message.js";

const validateToken = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(400).json({
      status: 400,
      message: ErrorMessages.TOKEN_NOT_FOUND,
    });
  }

  jwt.verify(token, Env.JWT_SECRET, (err, data) => {
    if (err) {
      return res
        .status(401)
        .json({ status: 401, message: ErrorMessages.INVALID_TOKEN });
    }
    req.tokenValue = data;
    next();
  });
};

export default validateToken;
