import jwt from "jsonwebtoken";
import Env from "../utils/constants/Env.js";
import { ErrorMessages } from "../utils/constants/Message.js";

const validateCookies = (cookieName, requireAuth = true) => {
  return async (req, res, next) => {
    const token = req.cookies?.[cookieName];

    // Continue as a guest
    if (!requireAuth && !token) {
      req.cookieValue = null; // No user, proceed as guest
      return next();
    }

    if (!token) {
      return res.status(400).json({
        status: 400,
        message: ErrorMessages.COOKIE_NOT_FOUND,
      });
    }

    // Continue as a user
    jwt.verify(token, Env.JWT_SECRET, (err, data) => {
      if (err) {
        return res
          .status(401)
          .json({ status: 401, message: ErrorMessages.INVALID_TOKEN });
      }
      req.cookieValue = data;
      next();
    });
  };
};

export default validateCookies;
