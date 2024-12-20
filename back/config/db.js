import mongoose from "mongoose";
import { MONGO_URI, DB_NAME } from "./env.js";

mongoose.set("sanitizeFilter", true);
mongoose.set("strictQuery", true);

const options = {
  dbName: DB_NAME,
};

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, options);
    console.log("Connected to MongoDB database");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;
