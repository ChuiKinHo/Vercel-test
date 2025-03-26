import Env from "../../../utils/constants/Env.js";

const resetPasswordContent = ({ email, link }) => {
  return {
    from: Env.Nodemailer_Admin_Email,
    to: email,
    subject: "ToiletGuide Reset Password",
    text: `Your ToiletGuide reset password link is: ${link}. Please click this link to reset your password.`,
    html: `
        <h2>ToiletGuide Email Verification</h2>
        <p>Dear User,</p>
        <p>Thank you for using ToiletGuide. Please use the following link to reset your password:</p>
        <p style="font-size: 14px; font-weight: bold;">${link}</p>
        <p>If you did not request this code, please ignore this email.</p>
        <footer>
          <p>Regards,<br/>The ToiletGuide Team</p>
        </footer>
      `,
  };
};

export default resetPasswordContent;
