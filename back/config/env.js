import dotenv from "dotenv";
dotenv.config();

const PORT = parseInt(process.env.PORT, 10) || 3000;
const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;
const SESSION_SECRET = process.env.SESSION_SECRET;
const STORE_SECRET = process.env.STORE_SECRET;

export { PORT, MONGO_URI, DB_NAME, SESSION_SECRET, STORE_SECRET };
