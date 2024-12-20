import express from "express";
import * as userMiddleware from "../middlewares/userMiddleware.js";
import * as channelMiddleware from "../middlewares/channelMiddleware.js";
import * as messageMiddleware from "../middlewares/messageMiddleware.js";
import * as messageController from "../controllers/messageController.js";

const router = express.Router();

router.get(
  "/allMessages/:channelId",
  userMiddleware.isAuthenticated,
  channelMiddleware.isChannelMemberOrAdmin,
  messageController.getMessages,
);

router.post(
  "/create",
  userMiddleware.isAuthenticated,
  channelMiddleware.isChannelMemberOrAdmin,
  messageController.createMessage,
);

router.delete(
  "/delete/:messageId",
  userMiddleware.isAuthenticated,
  messageMiddleware.isMessageOwnerOrAdmin,
  messageController.deleteMessage,
);

export default router;
