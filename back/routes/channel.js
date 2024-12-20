import express from "express";
import * as userMiddleware from "../middlewares/userMiddleware.js";
import * as channelMiddleware from "../middlewares/channelMiddleware.js";
import validationResult from "../middlewares/validationResult.js";
import * as channelController from "../controllers/channelController.js";
import { channelValidator } from "../validators/channelValidator.js";

const router = express.Router();

router.get("/", userMiddleware.isAuthenticated, channelController.getChannels);

router.post(
  "/create",
  userMiddleware.isAuthenticated,
  ...channelValidator,
  validationResult,
  channelMiddleware.isUserFriendWithMembers,
  channelController.createChannel,
);

router.delete(
  "/delete/:channelId",
  userMiddleware.isAuthenticated,
  channelMiddleware.isChannelOwnerOrAdmin,
  channelController.deleteChannel,
);

export default router;
