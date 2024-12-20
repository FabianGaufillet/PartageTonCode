import { DB_NAME, MONGO_URI, SESSION_SECRET, STORE_SECRET } from "./env.js";
import MongoStore from "connect-mongo";

export default {
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: MONGO_URI,
    dbName: DB_NAME,
    crypto: {
      secret: STORE_SECRET,
    },
  }),
};
