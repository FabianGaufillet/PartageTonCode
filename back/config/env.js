import dotenv from "dotenv";
dotenv.config();

const PORT = parseInt(process.env.PORT, 10) || 3000;
const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;
const SESSION_SECRET = process.env.SESSION_SECRET;
const STORE_SECRET = process.env.STORE_SECRET;
const IMGBB_API_KEY = process.env.IMGBB_API_KEY;
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT;
const MAILBOX_USER = process.env.MAILBOX_USER;
const MAILBOX_PASSWORD = process.env.MAILBOX_PASSWORD;
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

export {
  PORT,
  MONGO_URI,
  DB_NAME,
  SESSION_SECRET,
  STORE_SECRET,
  IMGBB_API_KEY,
  SMTP_HOST,
  SMTP_PORT,
  MAILBOX_USER,
  MAILBOX_PASSWORD,
  SENDGRID_API_KEY,
};
