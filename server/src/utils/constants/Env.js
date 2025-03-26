import dotenv from "dotenv";
dotenv.config();

const Env = {
  PORT: process.env.PORT || 3000,
  MongoDB_URL: process.env.MongoDB_URL,
  Cloudinary_Cloud_Name: process.env.Cloudinary_Cloud_Name,
  Cloudinary_Api_Key: process.env.Cloudinary_Api_Key,
  Cloudinary_Api_Secret: process.env.Cloudinary_Api_Secret,
  JWT_SECRET: process.env.JWT_SECRET,
  WEBSITE_DOMAIN: process.env.WEBSITE_DOMAIN,
  USER_RESET_PASSWORD_TOKEN_EXPIRES_IN:
    process.env.USER_RESET_PASSWORD_TOKEN_EXPIRES_IN,
  USER_REGISTRATION_TOKEN_COOKIE_EXPIRES_IN:
    process.env.USER_REGISTRATION_TOKEN_COOKIE_EXPIRES_IN,
  USER_REGISTRATION_TOKEN_EXPIRES_IN:
    process.env.USER_REGISTRATION_TOKEN_EXPIRES_IN,
  USER_REGISTRATION_TOKEN_COOKIE: process.env.USER_REGISTRATION_TOKEN_COOKIE,
  USER_REGISTRATION_VERIFICATION_CODE_EXPIRES_IN:
    process.env.USER_REGISTRATION_VERIFICATION_CODE_EXPIRES_IN,
  USER_LOGIN_TOKEN_COOKIE: process.env.USER_LOGIN_TOKEN_COOKIE,
  USER_LOGIN_TOKEN_COOKIE_EXPIRES_IN:
    process.env.USER_LOGIN_TOKEN_COOKIE_EXPIRES_IN,
  USER_LOGIN_TOKEN_EXPIRES_IN: process.env.USER_LOGIN_TOKEN_EXPIRES_IN,
  Nodemailer_Admin_Email: process.env.Nodemailer_Admin_Email,
  Nodemailer_Admin_Password: process.env.Nodemailer_Admin_Password,
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
};

export default Env;
