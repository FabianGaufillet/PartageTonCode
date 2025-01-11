import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import Comment from "./Comment.model.js";
import {
  postContentMaxLength,
  postContentMinLength,
  postTitleMaxLength,
  postTitleMinLength,
} from "../utils/constants.js";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      minLength: [
        postTitleMinLength,
        `Title must be at least ${postTitleMinLength} characters`,
      ],
      maxLength: [
        postTitleMaxLength,
        `Title must be less than ${postTitleMaxLength} characters`,
      ],
      required: [true, "Title is required"],
    },
    content: {
      type: String,
      trim: true,
      minLength: [
        postContentMinLength,
        `Content must be at least ${postContentMinLength} characters`,
      ],
      maxLength: [
        postContentMaxLength,
        `Content must be less than ${postContentMaxLength} characters`,
      ],
      required: [true, "Content is required"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    upvotes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "users",
      default: [],
    },
    comments: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "comments",
      default: [],
    },
  },
  { timestamps: true },
);

postSchema.plugin(mongoosePaginate);

postSchema.pre("findOneAndDelete", async function (next) {
  const doc = await this.model.findOne(this.getFilter());
  await Comment.deleteMany({ post: doc._id });
  next();
});

const Post = mongoose.model("posts", postSchema);
export default Post;
