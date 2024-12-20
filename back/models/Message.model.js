import mongoose from "mongoose";
import { messageMaxLength, messageMinLength } from "../utils/constants.js";

const messageSchema = new mongoose.Schema(
  {
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
      required: [true, "Channel is required"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
    },
    content: {
      type: String,
      trim: true,
      minlength: [
        messageMinLength,
        `Content must be at least ${messageMinLength} characters long`,
      ],
      maxlength: [
        messageMaxLength,
        `Content must be less than ${messageMaxLength} characters long`,
      ],
      required: [true, "Content is required"],
    },
  },
  { timestamps: true },
);

const Message = mongoose.model("messages", messageSchema);
export default Message;
