import express from "express";
import * as userMiddleware from "../middlewares/userMiddleware.js";
import * as notificationController from "../controllers/notificationController.js";

const router = express.Router();

router.get(
  "/",
  userMiddleware.isAuthenticated,
  notificationController.getNotifications,
);

router.post("/create", notificationController.createNotification);

router.put(
  "/markAsRead/:notificationId",
  userMiddleware.isAuthenticated,
  notificationController.markNotificationAsRead,
);

router.put(
  "/markAllAsRead",
  userMiddleware.isAuthenticated,
  notificationController.markAllNotificationsAsRead,
);

router.delete(
  "/remove/:notificationId",
  userMiddleware.isAuthenticated,
  notificationController.deleteNotification,
);

router.delete(
  "/removeAll",
  userMiddleware.isAuthenticated,
  notificationController.deleteAllNotifications,
);

export default router;
