import { body } from "express-validator";
import {
  commentContentMaxLength,
  commentContentMinLength,
} from "../utils/constants.js";

export const createCommentValidator = [
  body("postId")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Post id is required")
    .isMongoId()
    .withMessage("Post id must be a valid id"),
  body("content")
    .trim()
    .escape()
    .isLength({ min: commentContentMinLength, max: commentContentMaxLength })
    .withMessage(
      `Content must be between ${commentContentMinLength} and ${commentContentMaxLength} characters`,
    ),
];

export const updateCommentValidator = [
  body("commentId")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Comment Id is required")
    .isMongoId()
    .withMessage("Comment Id must be a valid id"),
  body("content")
    .if(body("content").exists())
    .trim()
    .escape()
    .isLength({ min: commentContentMinLength, max: commentContentMaxLength })
    .withMessage(
      `Content must be between ${commentContentMinLength} and ${commentContentMaxLength} characters`,
    ),
  body("upvotes")
    .if(body("upvotes").exists())
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Upvotes is required")
    .isMongoId()
    .withMessage("Upvotes must be a valid id")
    .custom((value, { req }) => {
      return req.user._id !== value;
    })
    .withMessage("You can't upvote your own comment"),
];
