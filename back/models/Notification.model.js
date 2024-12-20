import mongoose from "mongoose";
import {
  notificationTitleMinLength,
  notificationTitleMaxLength,
  notificationContentMinLength,
  notificationContentMaxLength,
} from "../utils/constants.js";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      trim: true,
      minLength: [
        notificationTitleMinLength,
        `Title must be at least ${notificationTitleMinLength} characters`,
      ],
      maxLength: [
        notificationTitleMaxLength,
        `Title must be less than ${notificationTitleMaxLength} characters`,
      ],
      required: [true, "Title is required"],
    },
    content: {
      type: String,
      trim: true,
      minLength: [
        notificationContentMinLength,
        `Content must be at least ${notificationContentMinLength} characters`,
      ],
      maxLength: [
        notificationContentMaxLength,
        `Content must be less than ${notificationContentMaxLength} characters`,
      ],
      required: [true, "Content is required"],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Notification = mongoose.model("notifications", notificationSchema);
export default Notification;
