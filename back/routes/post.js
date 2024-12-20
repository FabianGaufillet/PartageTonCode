import express from "express";
import * as postController from "../controllers/postController.js";
import * as userMiddleware from "../middlewares/userMiddleware.js";
import * as postMiddleware from "../middlewares/postMiddleware.js";
import validationResult from "../middlewares/validationResult.js";
import * as postValidator from "../validators/postValidator.js";

const router = express.Router();

router.get(
  "/allPosts/:userId",
  userMiddleware.isAuthenticated,
  userMiddleware.isProfileOwnerOrFriendOrAdmin,
  postController.getAllPosts,
);
router.get(
  "/:postId",
  userMiddleware.isAuthenticated,
  postMiddleware.checkPostId,
  postMiddleware.isPostOwnerOrFriendPostOrAdmin,
  postController.getPostById,
);

router.post(
  "/create",
  userMiddleware.isAuthenticated,
  postMiddleware.isProfileOwnerOrFriendOrAdmin,
  ...postValidator.createPostValidator,
  validationResult,
  postController.createPost,
);

router.put(
  "/update",
  userMiddleware.isAuthenticated,
  postMiddleware.isPostOwnerOrAdmin,
  ...postValidator.updatePostValidator,
  validationResult,
  postController.updatePost,
);
router.put(
  "/upvote",
  userMiddleware.isAuthenticated,
  ...postValidator.updatePostValidator,
  validationResult,
  postController.upvotePost,
);

router.delete(
  "/remove/:postId",
  userMiddleware.isAuthenticated,
  postMiddleware.checkPostId,
  postMiddleware.isPostOwnerOrAdmin,
  postController.removePost,
);

export default router;
