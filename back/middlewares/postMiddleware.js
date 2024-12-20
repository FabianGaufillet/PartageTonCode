import Post from "../models/Post.model.js";
import mongoose from "mongoose";
import Relationship from "../models/Relationship.model.js";

export const checkPostId = (req, res, next) => {
  const postId = req.params?.postId || req.body?.postId;
  if (!postId || !(postId instanceof mongoose.Types.ObjectId)) {
    return next({ status: 422, message: "Post id is required", data: null });
  }
  return next();
};

export const isProfileOwnerOrFriendOrAdmin = async (req, res, next) => {
  try {
    const { profile } = req.body;
    if (!profile) {
      return next({ status: 422, message: "Profile is required", data: null });
    }
    if (profile === req.user._id.toString() || "admin" === req.user.role) {
      return next();
    }
    const relationships = await Relationship.findOne(
      { user: req.user._id },
      { _id: 0, friends: 1 },
    );
    if (!relationships.friends.includes(profile)) {
      return next({
        status: 403,
        message: "You are not allowed to perform this action",
        data: null,
      });
    }
    return next();
  } catch (error) {
    return next({ status: 500, message: error.message, data: error });
  }
};

export const isPostOwnerOrFriendPostOrAdmin = async (req, res, next) => {
  try {
    const postId = req.body?.postId || req.params?.postId;
    const post = await Post.findById(postId);
    if (!post) {
      return next({
        status: 404,
        message: "Post not found",
        data: null,
      });
    }
    if ("admin" === req.user.role) {
      return next();
    }
    if (post.author === req.user._id.toString()) {
      return next();
    }
    const relationships = await Relationship.findOne(
      { user: req.user._id },
      { _id: 0, friends: 1 },
    );
    if (!relationships.friends.includes(post.author)) {
      return next({
        status: 403,
        message: "You are not allowed to perform this action",
        data: null,
      });
    }
    return next();
  } catch (error) {
    return next({ status: 500, message: error.message, data: error });
  }
};

export const isPostOwnerOrAdmin = async (req, res, next) => {
  try {
    const postId = req.body?.postId || req.params?.postId;
    if ("admin" === req.user.role) {
      return next();
    }
    const post = await Post.findById(postId);
    if (!post) {
      return next({
        status: 404,
        message: "Post not found",
        data: null,
      });
    }
    if (post.author !== req.user._id.toString()) {
      return next({
        status: 403,
        message: "You are not allowed to perform this action",
        data: null,
      });
    }
    return next();
  } catch (error) {
    return next({ status: 500, message: error.message, data: error });
  }
};
