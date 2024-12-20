import express from "express";
import http from "http";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import session from "express-session";
import fileUpload from "express-fileupload";
import { PORT } from "./config/env.js";
import connectDB from "./config/db.js";
import passport from "./config/passport.js";
import sessionOptions from "./config/session.js";
import corsOptions from "./config/cors.js";
import uploadOptions from "./config/upload.js";
import socketHandler from "./sockets/index.js";
import user from "./routes/user.js";
import post from "./routes/post.js";
import comment from "./routes/comment.js";
import relationship from "./routes/relationship.js";
import channel from "./routes/channel.js";
import message from "./routes/message.js";
import notification from "./routes/notification.js";
import upload from "./routes/upload.js";
import * as path from "node:path";

const app = express();
const server = http.createServer(app);
const __dirname = import.meta.dirname;

app.use(cors(corsOptions));
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session({}));
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload(uploadOptions));

// Fichiers statiques à servir pour Angular
app.use(express.static(path.join(__dirname, "/../front/dist/front/browser")));

const start = async () => {
  try {
    await connectDB();
    socketHandler(server);

    app.use((req, res, next) => {
      res.setHeader(
        "Content-Security-Policy",
        "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; script-src-attr 'self' 'unsafe-inline'; font-src 'self' https://fonts.gstatic.com",
      );
      next();
    });

    app.use("/api/user", user);
    app.use("/api/post", post);
    app.use("/api/comment", comment);
    app.use("/api/relationship", relationship);
    app.use("/api/channel", channel);
    app.use("/api/message", message);
    app.use("/api/notification", notification);
    app.use("/api/upload", upload);

    // Redirection des requêtes vers "index.html" pour le routage Angular
    app.get("*", (req, res) => {
      res.sendFile(
        path.join(__dirname, "/../front/dist/front/browser/index.html"),
      );
    });

    app.use((error, req, res, _next) => {
      return res.status(error.status || 500).json({
        message: error.message || "Internal server error",
        data: error.data || null,
      });
    });

    app.listen({ port: PORT }, () => {
      console.log(`Server running on port ${PORT}`);
    });

    return app;
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const application = await start();
export default application;
