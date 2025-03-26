import nodemailer from "nodemailer";
import Env from "../../utils/constants/Env.js";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: Env.Nodemailer_Admin_Email,
    pass: Env.Nodemailer_Admin_Password,
  },
  tls: {
    rejectUnauthorized: false, // Bypass self-signed certificate validation
  },
});

export default transporter;
