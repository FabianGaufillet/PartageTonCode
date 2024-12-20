import mongoose from "mongoose";
import {
  commentContentMinLength,
  commentContentMaxLength,
} from "../utils/constants.js";

const commentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      trim: true,
      minlength: [
        commentContentMinLength,
        `Comment must be at least ${commentContentMinLength} characters long`,
      ],
      maxlength: [
        commentContentMaxLength,
        `Comment must be less than ${commentContentMaxLength} characters long`,
      ],
      required: [true, "Comment is required"],
    },
    upvotes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
  },
  { timestamps: true },
);

const Comment = mongoose.model("comments", commentSchema);
export default Comment;
