import transporter from "../config/nodemailer.js";
import sgMail from "@sendgrid/mail";
import { SENDGRID_API_KEY } from "../config/env.js";

export const sendEmail = async (mailOptions) => {
  try {
    if (SENDGRID_API_KEY) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      const response = await sgMail.send(mailOptions);
      return {
        status: response[0].statusCode,
        message: "Email sent",
        data: response,
      };
    } else {
      const info = await transporter.sendMail(mailOptions);
      if (info.rejected.length > 0) {
        return { status: 400, message: "Email rejected", data: info };
      }
      return { status: 200, message: "Email sent", data: info };
    }
  } catch (error) {
    return { status: 500, message: error.message, data: error };
  }
};
