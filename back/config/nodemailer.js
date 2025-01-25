import nodemailer from "nodemailer";
import { SMTP_PORT, SMTP_HOST, MAILBOX_USER, MAILBOX_PASSWORD } from "./env.js";

export default nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: {
    user: MAILBOX_USER,
    pass: MAILBOX_PASSWORD,
  },
});
