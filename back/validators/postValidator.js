import { body } from "express-validator";
import {
  postContentMaxLength,
  postContentMinLength,
  postTitleMaxLength,
  postTitleMinLength,
} from "../utils/constants.js";

export const createPostValidator = [
  body("title")
    .trim()
    .escape()
    .isLength({ min: postTitleMinLength, max: postTitleMaxLength })
    .withMessage(
      `Title must be between ${postTitleMinLength} and ${postTitleMaxLength} characters`,
    ),
  body("content")
    .trim()
    .escape()
    .isLength({ min: postContentMinLength, max: postContentMaxLength })
    .withMessage(
      `Content must be between ${postContentMinLength} and ${postContentMaxLength} characters`,
    ),
  body("profile")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Profile is required")
    .isMongoId()
    .withMessage("Profile must be a valid id"),
];

export const updatePostValidator = [
  body("postId")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Post Id is required")
    .isMongoId()
    .withMessage("Post Id must be a valid id"),
  body("title")
    .if(body("title").exists())
    .trim()
    .escape()
    .isLength({ min: postTitleMinLength, max: postTitleMaxLength })
    .withMessage(
      `Title must be between ${postTitleMinLength} and ${postTitleMaxLength} characters`,
    ),
  body("content")
    .if(body("content").exists())
    .trim()
    .escape()
    .isLength({ min: postContentMinLength, max: postContentMaxLength })
    .withMessage(
      `Content must be between ${postContentMinLength} and ${postContentMaxLength} characters`,
    ),
  body("upvotes")
    .if(body("upvotes").exists())
    .trim()
    .escape()
    .isMongoId()
    .withMessage("Upvotes must be a valid id")
    .custom((value, { req }) => {
      return req.user._id !== value;
    })
    .withMessage("You can't upvote your own post"),
];
