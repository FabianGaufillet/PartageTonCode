import express from "express";
import * as commentController from "../controllers/commentController.js";
import * as userMiddleware from "../middlewares/userMiddleware.js";
import * as commentMiddleware from "../middlewares/commentMiddleware.js";
import * as postMiddleware from "../middlewares/postMiddleware.js";
import validationResult from "../middlewares/validationResult.js";
import * as commentValidator from "../validators/commentValidator.js";

const router = express.Router();

router.post(
  "/create",
  userMiddleware.isAuthenticated,
  postMiddleware.isPostOwnerOrFriendPostOrAdmin,
  ...commentValidator.createCommentValidator,
  validationResult,
  commentController.createComment,
);

router.put(
  "/update",
  userMiddleware.isAuthenticated,
  commentMiddleware.isCommentOwnerOrAdmin,
  ...commentValidator.updateCommentValidator,
  validationResult,
  commentController.updateComment,
);
router.put(
  "/upvote",
  userMiddleware.isAuthenticated,
  ...commentValidator.updateCommentValidator,
  validationResult,
  commentController.upvoteComment,
);

router.delete(
  "/remove/:commentId",
  userMiddleware.isAuthenticated,
  commentMiddleware.isCommentOwnerOrAdmin,
  commentController.removeComment,
);

export default router;
